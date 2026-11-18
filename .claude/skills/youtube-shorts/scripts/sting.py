"""Three-Whistle Sting (sonic logo) — synthesised placeholder, 0 credits.
Usage: python3 sting.py out.wav [--rocket]
Pitches are fixed brand values: G5, B5, D6, then a steel 'ting' (G6 + D7).
For the final logo, prefer a recorded real cooker whistle pitch-corrected to the same notes.
"""
import sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)

def env(n, a=0.01, r=0.08):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.minimum(1, (n / SR - t) / r)
    return np.clip(e, 0, 1)

def bandnoise(n, lo, hi):
    x = rng.standard_normal(n)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n)
    return y / (np.abs(y).max() + 1e-9)

def whistle(freq, dur, vib_hz=0.0, vib_cents=0.0, breath=0.25, glide_to=None):
    n = int(dur * SR); t = np.arange(n) / SR
    f = np.full(n, freq, dtype=float)
    if glide_to: f = freq * (glide_to / freq) ** (t / dur)
    if vib_hz: f = f * 2 ** (vib_cents / 1200 * np.sin(2 * np.pi * vib_hz * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.18 * np.sin(2 * ph)
    air = bandnoise(n, freq * 0.8, freq * 3.5) * breath
    return (tone * (1 - breath) + air) * env(n, 0.015, 0.06)

def ting(dur=0.6):
    n = int(dur * SR); t = np.arange(n) / SR
    y = 0.6 * np.sin(2 * np.pi * 1568 * t) * np.exp(-t * 6) + 0.4 * np.sin(2 * np.pi * 2349 * t) * np.exp(-t * 9)
    return y * env(n, 0.002, 0.05)

def place(buf, sig, at, gain_db):
    i = int(at * SR); g = 10 ** (gain_db / 20)
    buf[i:i + len(sig)] += sig[: len(buf) - i] * g

def build(rocket=False):
    total = 3.6 if rocket else 2.2
    out = np.zeros(int(total * SR))
    n = int(0.42 * SR)  # pressure build: rising hiss
    hiss = bandnoise(n, 2000, 7000) * np.linspace(0.05, 1, n) ** 2
    place(out, hiss * env(n, 0.05, 0.05), 0.0, -14)
    place(out, whistle(784, 0.18), 0.45, -6)             # G5
    place(out, whistle(988, 0.18), 0.75, -6)             # B5
    if rocket:
        place(out, whistle(1175, 2.2, 5.5, 20, 0.3, glide_to=1760), 1.05, -5)  # D6 -> A6 (up a fifth)
        n2 = int(1.2 * SR)
        place(out, bandnoise(n2, 300, 4000) * np.linspace(1, 0, n2) * env(n2, 0.2, 0.3), 2.3, -16)
    else:
        place(out, whistle(1175, 0.42, 5.5, 20, 0.3), 1.05, -5)  # D6 with vibrato
        place(out, ting(), 1.50, -8)
    peak = np.abs(out).max()
    return out / peak * 10 ** (-1 / 20)  # normalise to -1 dBFS

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "sting.wav"
    y = build("--rocket" in sys.argv)
    pcm = (y * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"wrote {path} ({len(y)/SR:.2f}s)")
