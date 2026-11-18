"""pauses.py <voice.wav|mp3> — print speech start/end and pauses (RMS every 20 ms; silence < -42 dB for >= 0.1 s).
Use the pause boundaries to place word/phrase times in timing.ts. Requires ffmpeg and numpy.
"""
import subprocess, sys
import numpy as np

src = sys.argv[1]
SR = 16000
HOP = int(0.02 * SR)
raw = subprocess.run(
    ["ffmpeg", "-nostdin", "-loglevel", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
    capture_output=True, check=True,
).stdout
x = np.frombuffer(raw, np.float32)
n = len(x) // HOP
rms = np.sqrt((x[: n * HOP].reshape(n, HOP) ** 2).mean(1) + 1e-12)
db = 20 * np.log10(rms / (np.abs(x).max() + 1e-9))
quiet = db < -42
spans, start = [], None
for i, q in enumerate(np.append(quiet, False)):
    if q and start is None:
        start = i
    if not q and start is not None:
        if (i - start) * 0.02 >= 0.1:
            spans.append((start * 0.02, i * 0.02))
        start = None
voiced = np.where(~quiet)[0]
print(f"speech {voiced[0] * 0.02:.2f} - {(voiced[-1] + 1) * 0.02:.2f} s")
for a, b in spans:
    if voiced[0] * 0.02 < a and b < voiced[-1] * 0.02:
        print(f"pause {a:.2f} - {b:.2f}")
