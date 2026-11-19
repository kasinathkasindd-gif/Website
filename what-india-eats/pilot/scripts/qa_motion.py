"""Motion QA for a rendered Short: finds frozen stretches and one-frame glitches (0 credits).

Usage: python3 scripts/qa_motion.py out/episode.mp4 [--max-still 0.5]

- Frozen stretch: the picture outside the caption band barely changes (only lip-flap / captions move) for longer
  than --max-still seconds. EP001's first cut had 11 of them (≈17 s of 58 s): the voice was longer than the
  animation keys, so shots finished and held.
- Glitch: a single frame that differs from both neighbours while the neighbours agree (e.g. a sprite that failed
  to load for one frame).
Exit code 1 if anything is found, so it can gate a render.
"""
import argparse
import subprocess
import sys

import numpy as np

W, H, FPS = 135, 240, 30


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--max-still", type=float, default=0.5)
    ap.add_argument("--threshold", type=float, default=0.12, help="mean abs pixel change (0-255) that counts as motion")
    a = ap.parse_args()
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", a.video, "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    n = len(F)
    mask = np.ones((H, W), bool)
    mask[154:186, :] = False  # caption band (y ≈ 1230–1490 of 1920)
    d = np.array([np.abs(F[i + 1] - F[i])[mask].mean() for i in range(n - 1)])
    glitches = []
    for i in range(1, n - 1):
        x, y = d[i - 1], d[i]
        z = np.abs(F[i + 1] - F[i - 1])[mask].mean()
        if x > 1.5 and y > 1.5 and z < 0.5 * min(x, y):
            glitches.append(round(i / FPS, 2))
    still, s = [], None
    for i, v in enumerate(list(d) + [1e9]):
        if v < a.threshold and s is None:
            s = i
        elif v >= a.threshold and s is not None:
            if (i - s) / FPS > a.max_still:
                still.append((round(s / FPS, 2), round(i / FPS, 2)))
            s = None
    total_still = sum(b - a_ for a_, b in still)
    print(f"{n} frames ({n / FPS:.1f} s) | glitch frames: {glitches or 'none'}")
    print(f"frozen stretches > {a.max_still}s: {len(still)} ({total_still:.1f} s)")
    for a_, b in still:
        print(f"  {a_:6.2f} – {b:6.2f}  ({b - a_:.2f} s)")
    prof = [round(float(d[k * FPS:(k + 1) * FPS].mean()), 2) for k in range(int(np.ceil((n - 1) / FPS)))]
    print("motion per second:", prof)
    sys.exit(1 if glitches or still else 0)


if __name__ == "__main__":
    main()
