"""Synthesise every sound for the EP001 animatic (0 credits, fully original).
Usage: python3 scripts/make_audio.py  -> writes public/audio/*.wav (48 kHz mono, peak -1 dBFS)
Brand pitches are fixed: whistles G5 (784 Hz), B5 (988 Hz), D6 (1175 Hz).
"""
import os, sys, wave
import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(1994)


def T(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.005, r=0.05):
    t = np.arange(n) / SR
    d = n / SR
    return np.clip(np.minimum(1, t / max(a, 1e-4)) * np.minimum(1, (d - t) / max(r, 1e-4)), 0, 1)


def band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, len(x))
    return y / (np.abs(y).max() + 1e-9)


def noise(d, lo=20, hi=20000):
    return band(rng.standard_normal(int(d * SR)), lo, hi)


def tone(freqs, d, harm=(1.0,), vib=(0, 0)):
    t = T(d)
    f = np.asarray(freqs if np.ndim(freqs) else np.full(len(t), freqs), float)
    if vib[0]:
        f = f * 2 ** (vib[1] / 1200 * np.sin(2 * np.pi * vib[0] * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return sum(a * np.sin((k + 1) * ph) for k, a in enumerate(harm))


def whistle(freq, d, vib_hz=5.5, cents=20, breath=0.28, attack_glide=0.0):
    t = T(d)
    f = np.full(len(t), freq, float)
    if attack_glide:
        f = freq * (1 - attack_glide * np.exp(-t / 0.03))
    y = tone(f, d, harm=(1.0, 0.18), vib=(vib_hz, cents)) * (1 - breath)
    y = y + noise(d, freq * 0.8, freq * 3.5) * breath
    return y * env(len(t), 0.012, 0.07)


def place(buf, sig, at, db=0.0):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * 10 ** (db / 20)


def ks_pluck(freq, d, damp=0.996):
    n = int(d * SR)
    p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = damp * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out * env(n, 0.002, 0.08)


def save(name, y, peak_db=-1.0):
    y = np.asarray(y, float)
    y = y / (np.abs(y).max() + 1e-9) * 10 ** (peak_db / 20)
    pcm = (y * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"{name:16s} {len(y)/SR:5.2f}s")


def sweep_noise(d, f0, f1, width=0.6, segs=24):
    """Noise whose band centre moves from f0 to f1 (overlap-add of band-passed grains)."""
    n = int(d * SR)
    out = np.zeros(n + SR)
    g = n // segs * 2
    for k in range(segs):
        c = f0 * (f1 / f0) ** (k / (segs - 1))
        grain = noise(g / SR, c * (1 - width / 2), c * (1 + width / 2)) * np.hanning(g)
        place(out, grain, k * (n // segs) / SR)
    return out[:n]


# ---------------- brand whistles and sting ----------------
save("whistle_hook", whistle(1175, 0.42, 6, 25, 0.33, attack_glide=0.16))
save("whistle_G5", whistle(784, 0.30))
save("whistle_B5", whistle(988, 0.30))
save("whistle_D6", whistle(1175, 0.42))
sting = np.zeros(int(2.2 * SR))
place(sting, noise(0.42, 2000, 7000) * np.linspace(0.05, 1, int(0.42 * SR)) ** 2, 0.0, -14)
place(sting, whistle(784, 0.18), 0.45, -6)
place(sting, whistle(988, 0.18), 0.75, -6)
place(sting, whistle(1175, 0.42, 5.5, 20, 0.3), 1.05, -5)
tt = T(0.6)
ting = (0.6 * np.sin(2 * np.pi * 1568 * tt) * np.exp(-tt * 6) + 0.4 * np.sin(2 * np.pi * 2349 * tt) * np.exp(-tt * 9)) * env(len(tt), 0.002, 0.05)
place(sting, ting, 1.5, -8)
save("sting", sting)
cw = whistle(660, 0.95, 4.5, 30, 0.55) + noise(0.95, 3000, 9000) * 0.25 * env(int(0.95 * SR), 0.02, 0.3)
save("cousin_whistle", cw)

# ---------------- steam, puffs, whooshes ----------------
d = 0.6
save("steam_burst", noise(d, 1500, 9000) * np.exp(-T(d) * 5) * env(int(d * SR), 0.004, 0.1))
d = 0.25
save("pfft", noise(d, 500, 3000) * np.exp(-T(d) * 18) * env(int(d * SR), 0.003, 0.05))
d = 0.45
w = sweep_noise(d, 300, 2400)
save("whoosh", w * np.sin(np.pi * np.linspace(0, 1, len(w))) ** 1.5)
d = 0.5
w = sweep_noise(d, 2200, 300)
save("tumble", w * np.sin(np.pi * np.linspace(0, 1, len(w))) ** 1.2)
d = 1.5
r = sweep_noise(d, 200, 4000) * np.linspace(0.1, 1, int(d * SR)) ** 2 + 0.4 * tone(np.linspace(300, 1200, int(d * SR)), d) * np.linspace(0, 1, int(d * SR))
save("riser", r * env(len(r), 0.05, 0.05))

# ---------------- comic one-shots ----------------
d = 0.42
f = np.concatenate([np.linspace(300, 720, int(0.12 * SR)), 720 * (1 + 0.04 * np.sin(2 * np.pi * 14 * T(d - 0.12)))])
save("hop", tone(f, d, harm=(1, 0.3)) * np.exp(-T(d) * 5) * env(int(d * SR), 0.004, 0.08))
tw = np.zeros(int(0.9 * SR))
for k, fr in enumerate([1047, 1319, 1568, 2093]):
    tt = T(0.5)
    place(tw, np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 8), k * 0.09)
save("twinkle", tw)
d = 0.14
save("pop", (tone(np.linspace(900, 260, int(d * SR)), d) * np.exp(-T(d) * 30) + 0.2 * noise(d, 2000, 8000) * np.exp(-T(d) * 80)))
tt = T(0.9)
save("ding", (0.6 * np.sin(2 * np.pi * 1568 * tt) * np.exp(-tt * 4) + 0.4 * np.sin(2 * np.pi * 2349 * tt) * np.exp(-tt * 6) + 0.15 * np.sin(2 * np.pi * 3136 * tt) * np.exp(-tt * 9)))
tt = T(0.55)
clink = sum(a * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * dk) for fr, a, dk in [(2140, 1, 9), (3310, 0.6, 12), (5230, 0.35, 16)])
save("clink", clink * env(len(tt), 0.001, 0.05))
d = 0.3
door = np.zeros(int(d * SR))
place(door, noise(0.02, 1500, 6000), 0.0, -4)
place(door, tone(np.linspace(140, 90, int(0.2 * SR)), 0.2) * np.exp(-T(0.2) * 14), 0.02)
save("door", door)
d = 0.3
land = tone(np.linspace(85, 48, int(d * SR)), d) * np.exp(-T(d) * 12) + 0.25 * noise(d, 200, 1500) * np.exp(-T(d) * 40)
save("land", land)
d = 0.35
stamp = tone(np.linspace(75, 45, int(d * SR)), d) * np.exp(-T(d) * 10)
place(stamp, noise(0.035, 800, 2200), 0.0, -2)
save("stamp", stamp)

# ---------------- places and process ----------------
d = 7.0
wd = noise(d, 180, 1100) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.28 * T(d) + 1.0)) * env(int(d * SR), 0.6, 0.8)
save("wind", wd)
d = 2.0
t = T(d)
rpm = np.interp(t, [0, 0.7, 0.95, 2.0], [62, 70, 48, 40])
saw = 2 * ((np.cumsum(rpm) / SR) % 1) - 1
eng = band(saw, 30, 900) * (0.7 + 0.3 * np.sin(2 * np.pi * 9 * t)) + 0.3 * noise(d, 60, 700)
save("jeep", eng * env(len(t), 0.25, 0.4))
d = 3.0
ch = np.zeros(int(d * SR))
for k in range(int(d * 1.6)):
    at = k / 1.6
    place(ch, tone(np.linspace(110, 70, int(0.18 * SR)), 0.18) * np.exp(-T(0.18) * 16), at)
    g = noise(0.35, 250, 1400) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 22 * T(0.35)))) * np.exp(-T(0.35) * 7)
    place(ch, g, at + 0.04, -6)  # the "gur-gur" gurgle
save("churn", ch)
d = 1.0
bub = np.repeat(rng.uniform(0.3, 1, int(d * 40)), int(SR / 40))[: int(d * SR)]
save("pour", noise(d, 300, 2500) * bub * env(int(d * SR), 0.05, 0.2))
d = 0.9
sq = np.zeros(int(d * SR))
for k in range(3):
    g = noise(0.18, 120, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 260 * T(0.18))) * np.hanning(int(0.18 * SR))
    place(sq, g, 0.05 + k * 0.28)
save("squish", sq)
d = 2.2
cg = np.zeros(int(d * SR))
tt = 0.0
k = 0
while tt < d - 0.12:
    rate = 3 + 5 * (tt / d)
    place(cg, noise(0.09, 200, 1500) * np.exp(-T(0.09) * 30), tt, -2 if k % 2 == 0 else -7)
    tt += 1 / rate / 2
    k += 1
save("chug", cg * np.linspace(0.4, 1, len(cg)))

# ---------------- music beds (original) ----------------
def bed_breakfast(d=7.5, bpm=92):
    out = np.zeros(int(d * SR) + SR)
    t = T(d)
    drone = 0.25 * np.sin(2 * np.pi * 110 * t) + 0.18 * np.sin(2 * np.pi * 164.81 * t) + 0.08 * np.sin(2 * np.pi * 220 * t)
    out[: len(t)] += drone * (0.6 + 0.4 * np.sin(2 * np.pi * 0.12 * t)) * env(len(t), 0.8, 0.8)
    scale = [440, 493.88, 554.37, 659.25, 739.99, 880]
    pat = [0, 2, 3, 2, 4, 3, 2, 1, 0, 2, 3, 5, 4, 3, 2, 0]
    beat = 60 / bpm
    for i in range(int(d / (beat / 2))):
        at = i * beat / 2
        if i % 2 == 0:
            place(out, ks_pluck(scale[pat[(i // 2) % len(pat)]], 0.7) * 0.55, at)
        place(out, noise(0.05, 5000, 12000) * np.exp(-T(0.05) * 60) * 0.18, at)  # shaker
    for at in np.arange(0, d, beat * 4):
        tt = T(1.2)
        place(out, 0.18 * np.sin(2 * np.pi * 1760 * tt) * np.exp(-tt * 3), at + beat * 2)
    return out[: int(d * SR)] * env(int(d * SR), 0.15, 0.6)


def bed_lunch(d=9.5, bpm=108):
    out = np.zeros(int(d * SR) + SR)
    beat = 60 / bpm
    roots = [73.42, 73.42, 110.0, 98.0]
    for i in range(int(d / (beat / 2))):
        at = i * beat / 2
        step = i % 8
        if step in (0, 3, 4):
            place(out, tone(np.linspace(95, 58, int(0.22 * SR)), 0.22) * np.exp(-T(0.22) * 12) * 0.9, at)  # low drum
        if step in (2, 6):
            sl = noise(0.07, 900, 3500) * np.exp(-T(0.07) * 45) + 0.4 * np.sin(2 * np.pi * 330 * T(0.07)) * np.exp(-T(0.07) * 40)
            place(out, sl * 0.6, at)  # slap
        if step in (1, 5, 7):
            place(out, noise(0.04, 3000, 9000) * np.exp(-T(0.04) * 70) * 0.25, at)  # tick
        if step == 0:
            bar = (i // 8) % len(roots)
            place(out, ks_pluck(roots[bar] * 2, 0.5, 0.993) * 0.6, at)
            place(out, ks_pluck(roots[bar] * 3, 0.4, 0.993) * 0.25, at + beat)
    return out[: int(d * SR)] * env(int(d * SR), 0.1, 0.6)


def bed_dinner(d=6.5, bpm=80):
    out = np.zeros(int(d * SR) + SR)
    t = T(d)
    drone = 0.22 * np.sin(2 * np.pi * 146.83 * t) + 0.16 * np.sin(2 * np.pi * 220 * t)
    out[: len(t)] += drone * env(len(t), 0.8, 0.8)
    beat = 60 / bpm
    mel = [(587.33, 2), (659.25, 1), (739.99, 1), (880.0, 2), (739.99, 1), (659.25, 1), (587.33, 2)]
    at = 0.2
    for fr, b in mel:
        dd = b * beat
        if at + dd > d:
            break
        fl = whistle(fr, dd * 0.95, 5.0, 14, 0.35) * 0.5
        place(out, fl, at)
        at += dd
    for k, a2 in enumerate(np.arange(0, d, beat * 4)):
        tt = T(1.6)
        place(out, 0.14 * np.sin(2 * np.pi * 1174.66 * tt) * np.exp(-tt * 2.5), a2)
    return out[: int(d * SR)] * env(int(d * SR), 0.3, 0.8)


save("bed_breakfast", bed_breakfast())
save("bed_lunch", bed_lunch())
save("bed_dinner", bed_dinner())
print("done ->", os.path.abspath(OUT))
