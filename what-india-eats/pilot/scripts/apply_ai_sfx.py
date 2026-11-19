"""Swap synthesized placeholders for realistic AI sound effects (Higgsfield Mirelo, 0.5 credits per 2 s clip).

Usage: python3 scripts/apply_ai_sfx.py SFX_DIR
SFX_DIR holds any of: wind, ladle, churn, pour, jeep, fire (.mp3/.wav). Each is trimmed, faded, looped to the
length the edit needs and peak-normalized to -1 dBFS, then written over public/audio/<target>.wav.
"""
import os
import subprocess
import sys
import wave

import numpy as np

SR = 48000
AUDIO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "audio")
# source name -> (target file, seconds needed; loops with crossfades if the clip is shorter)
MAP = {
    "wind": ("wind", 10.0),
    "ladle": ("clink", None),
    "churn": ("churn", 3.0),
    "pour": ("pour", None),
    "jeep": ("jeep", 2.0),
    "fire": ("fire", 10.0),
}


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


def loop_to(x, d, xf=0.25):
    n, k = int(d * SR), int(xf * SR)
    if len(x) >= n or len(x) <= 2 * k:
        return x[:n]
    out = x.copy()
    fade = np.linspace(0, 1, k)
    while len(out) < n:
        out[-k:] = out[-k:] * fade[::-1] + x[:k] * fade
        out = np.concatenate([out, x[k:]])
    return out[:n]


def save(name, y):
    y = y / (np.abs(y).max() + 1e-9) * 10 ** (-1 / 20)
    with wave.open(os.path.join(AUDIO, f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((y * 32767).astype("<i2").tobytes())


for f in sorted(os.listdir(sys.argv[1])):
    src = os.path.splitext(f)[0]
    if src not in MAP:
        continue
    target, need = MAP[src]
    x = load(os.path.join(sys.argv[1], f))
    if need:
        x = loop_to(x, need)
    n = int(0.01 * SR)
    x[:n] *= np.linspace(0, 1, n)
    x[-4 * n :] *= np.linspace(1, 0, 4 * n)
    save(target, x)
    print(f"{f} -> audio/{target}.wav ({len(x) / SR:.2f}s)")
