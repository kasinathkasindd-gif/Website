"""Fit EP001's animation to a real voice-over (0 credits).

Usage:
  python3 scripts/build_timing.py --vo VO_DIR [--host HOST.wav] [--tempo 1.15] [--max-pause 0.22] [--sprites]
                                  [--props out/props.json]

VO_DIR holds one file per caption cue: 00.wav ... 20.wav (any format ffmpeg reads).
Writes:
  public/vo/NN.wav, public/vo/host.wav   trimmed, level-matched voice lines (48 kHz mono)
  out/props.json                         {"timing": {...}, "sprites": bool} for scripts/render.cjs (EP_PROPS)

How the timing works:
  Every shot, caption and sound in src/Ep001.tsx is written in *script seconds*. This script places each voice
  line after the previous one (short gap inside a sentence, longer between sentences), keeps story beats in
  order (a meal whistle only after its line, the host's "Every day!" before Seetu answers, the closing line
  after the three-whistle sting) and never squeezes the on-screen action by more than MAX_SQUEEZE. The result
  is a piecewise-linear map script time -> real time ("anchors"); Ep001 plays every shot through that map.
"""
import argparse
import json
import os
import re
import subprocess
import wave

import numpy as np

SR = 48000
FPS = 30
MAX_SQUEEZE = 1.4  # on-screen action may play up to 40% faster than scripted, never more
GAP_IN_SENTENCE = 0.08  # after a line ending in , : … (the sentence continues)
GAP_BETWEEN = 0.18
LOOP_TAIL = 2.0  # the last shot rebuilds frame 1 for a seamless loop; keep its length exact

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# Story beats that must stay in order: (script time, label, must follow the end of this cue, hold before next line)
EVENTS = [
    (14.5, "meal-1 whistle", 9, 0.4),
    (20.6, "meal-2 whistle", 10, 0.4),
    (22.6, "host: Every day!", 11, None),  # hold = host line length + 0.12
    (30.7, "meal-3 whistle", 15, 0.55),
    (39.77, "map stamp", 18, 0.0),
    (40.0, "three-whistle sting", None, 1.4),  # the closing line starts as the third whistle ends
    (44.0, "cliffhanger ends", 20, 0.0),
]


def read_audio(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True,
        check=True,
    ).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


def frame_db(x, hop):
    n = max(1, len(x) // hop)
    seg = x[: n * hop].reshape(n, hop)
    return 20 * np.log10(np.sqrt((seg**2).mean(1)) + 1e-9)


def trim(x, pad=0.03):
    hop = int(0.01 * SR)
    db = frame_db(x, hop)
    on = np.where(db > max(-45.0, db.max() - 38))[0]
    if len(on) == 0:
        return x
    a = max(0, on[0] * hop - int(pad * SR))
    b = min(len(x), (on[-1] + 1) * hop + int(pad * SR))
    return x[a:b]


def tighten_pauses(x, max_pause):
    """Shorten silences inside a line (TTS often stretches "..." and commas) to at most max_pause seconds."""
    hop = int(0.01 * SR)
    db = frame_db(x, hop)
    silent = db < max(-50.0, db.max() - 35)
    keep = np.ones(len(x), bool)
    k = 0
    n = len(silent)
    while k < n:
        if silent[k]:
            j = k
            while j < n and silent[j]:
                j += 1
            if k > 0 and j < n and (j - k) * hop > max_pause * SR:  # interior pause only
                cut_a = k * hop + int(max_pause * SR / 2)
                cut_b = j * hop - int(max_pause * SR / 2)
                keep[cut_a:cut_b] = False
            k = j
        else:
            k += 1
    return x[keep]


def change_tempo(x, tempo):
    """Pitch-preserving speed-up; sox's speech mode sounds cleaner than ffmpeg atempo."""
    if abs(tempo - 1) < 1e-3:
        return x
    import tempfile

    with tempfile.TemporaryDirectory() as d:
        a, b = os.path.join(d, "a.wav"), os.path.join(d, "b.wav")
        write_wav(a, x / max(1.0, np.abs(x).max()))
        try:
            subprocess.run(["sox", a, b, "tempo", "-s", str(tempo)], check=True, capture_output=True)
        except (FileNotFoundError, subprocess.CalledProcessError):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a, "-filter:a", f"atempo={tempo}", b], check=True)
        return read_audio(b)


def level_match(x, target_db=-19.0, peak_db=-1.5):
    hop = int(0.02 * SR)
    db = frame_db(x, hop)
    voiced = db[db > db.max() - 30]
    rms_db = 10 * np.log10(np.mean(10 ** (voiced / 10))) if len(voiced) else -60
    y = x * 10 ** ((target_db - rms_db) / 20)
    pk = np.abs(y).max() + 1e-9
    lim = 10 ** (peak_db / 20)
    if pk > lim:
        y *= lim / pk
    n = int(0.008 * SR)
    ramp = np.linspace(0, 1, n)
    y[:n] *= ramp
    y[-n:] *= ramp[::-1]
    return y


def write_wav(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def read_cues():
    src = open(os.path.join(ROOT, "src", "Ep001.tsx"), encoding="utf8").read()
    block = src[src.index("export const CUES") : src.index("];", src.index("export const CUES"))]
    cues = re.findall(r"\{from: ([\d.]+), to: ([\d.]+), text: (['\"])(.*?)\3\}", block)
    return [(float(a), float(b), t) for a, b, _q, t in cues]


def solve(cues, durs, host_dur):
    """Return anchors [(script s, real s)], real line starts, event times."""
    pts = [(s, "line", i) for i, (s, _e, _t) in enumerate(cues)]
    pts += [(s, "event", k) for k, (s, *_r) in enumerate(EVENTS)]
    pts.sort(key=lambda p: (p[0], 0 if p[1] == "event" else 1))
    starts, ends, ev_r = {}, {}, {}
    anchors = [(0.0, 0.0)]
    prev_s, prev_r = 0.0, 0.0
    hold_until = 0.0
    last_end, last_text = 0.0, ""
    for s, kind, k in pts:
        lo = prev_r + (s - prev_s) / MAX_SQUEEZE
        if kind == "line":
            gap = GAP_IN_SENTENCE if re.search(r"[,:…]$|\.\.\.$", last_text.strip()) else GAP_BETWEEN
            r = max(lo, (last_end + gap) if k else 0.15, hold_until)
            starts[k], ends[k] = r, r + durs[k]
            last_end, last_text = ends[k], cues[k][2]
            hold_until = 0.0
        else:
            _s, _label, after, hold = EVENTS[k]
            r = max(lo, ends[after] + 0.10) if after is not None else lo
            ev_r[k] = r
            h = (host_dur + 0.12) if hold is None else hold
            hold_until = max(hold_until, r + h)
        anchors.append((s, r))
        prev_s, prev_r = s, r
    end_s = 46.0
    anchors.append((end_s, prev_r + LOOP_TAIL))
    return anchors, starts, ev_r


def mouth_track(lines, total):
    """Per-frame mouth openness from the voice: 0 = silent, else 0.05 + 0.95 * loudness."""
    n = int(round(total * FPS))
    buf = np.zeros(int(total * SR) + SR)
    spans = []
    for start, x in lines:
        a = int(start * SR)
        buf[a : a + len(x)] += x
        spans.append((start, start + len(x) / SR))
    win = int(0.05 * SR)
    db = np.full(n, -90.0)
    for f in range(n):
        c = int(f / FPS * SR)
        seg = buf[max(0, c - win // 2) : c + win // 2]
        if len(seg):
            db[f] = 20 * np.log10(np.sqrt((seg**2).mean()) + 1e-9)
    talking = np.zeros(n, bool)
    for a, b in spans:
        talking[int(a * FPS) : int(np.ceil(b * FPS))] = True
    ceil = np.percentile(db[talking], 95) if talking.any() else -20
    lvl = np.clip((db - (ceil - 24)) / 24, 0, 1)
    lvl = np.convolve(lvl, [0.25, 0.5, 0.25], "same")
    return [round(0.05 + 0.95 * float(v), 3) if t else 0 for v, t in zip(lvl, talking)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--vo", required=True)
    ap.add_argument("--host")
    ap.add_argument("--sprites", action="store_true")
    ap.add_argument("--tempo", type=float, default=1.0, help="speech speed-up, e.g. 1.15")
    ap.add_argument("--max-pause", type=float, default=0.22, help="longest silence kept inside a line (s)")
    ap.add_argument("--props", default=os.path.join(ROOT, "out", "props.json"))
    a = ap.parse_args()

    cues = read_cues()
    lines = []
    for i in range(len(cues)):
        cand = [f for f in os.listdir(a.vo) if re.match(rf"0*{i}\.(wav|mp3|flac|ogg)$", f)]
        if not cand:
            raise SystemExit(f"missing voice line {i:02d} in {a.vo}")
        x = trim(read_audio(os.path.join(a.vo, sorted(cand)[0])))
        x = level_match(change_tempo(tighten_pauses(x, a.max_pause), a.tempo))
        write_wav(os.path.join(ROOT, "public", "vo", f"{i:02d}.wav"), x)
        lines.append(x)
    durs = [len(x) / SR for x in lines]
    host = None
    if a.host:
        host = level_match(change_tempo(trim(read_audio(a.host)), a.tempo))
        write_wav(os.path.join(ROOT, "public", "vo", "host.wav"), host)
    host_dur = len(host) / SR if host is not None else 0.0

    anchors, starts, ev_r = solve(cues, durs, host_dur)
    total = anchors[-1][1]
    timing = {
        "lines": [{"i": i, "file": f"vo/{i:02d}.wav", "start": round(starts[i], 3), "dur": round(durs[i], 3)} for i in range(len(cues))],
        "extra": ([{"file": "vo/host.wav", "start": round(ev_r[2], 3), "db": -3}] if host is not None else []),
        "anchors": [[round(s, 3), round(r, 3)] for s, r in anchors],
        "total": round(total, 3),
        "mouth": mouth_track([(starts[i], lines[i]) for i in range(len(cues))], total),
    }
    os.makedirs(os.path.dirname(a.props), exist_ok=True)
    json.dump({"timing": timing, "sprites": bool(a.sprites)}, open(a.props, "w"))

    words = sum(len(t.split()) for _s, _e, t in cues)
    speech = sum(durs)
    print(f"{'#':>2} {'script':>6} {'real':>6} {'len':>5}  text")
    for i, (s, _e, t) in enumerate(cues):
        print(f"{i:2d} {s:6.2f} {starts[i]:6.2f} {durs[i]:5.2f}  {t}")
    for k, (s, label, _a, _h) in enumerate(EVENTS):
        print(f"   {s:6.2f} {ev_r[k]:6.2f}        [{label}]")
    print(f"total {total:.2f} s (script 46.00) | speech {speech:.1f} s, {words} words, {words / speech:.2f} words/s while talking")
    print("props ->", os.path.abspath(a.props))


if __name__ == "__main__":
    main()
