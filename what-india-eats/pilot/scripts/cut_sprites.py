"""Cut the faceless 3D-rendered Seetu into a lid layer and a body layer (0 credits).

Usage: python3 scripts/cut_sprites.py FACELESS.png   -> public/seetu3d/lid.png, body.png (+ prints rig placement)

FACELESS.png is the 1024x1024 transparent render made from the approved design with the face, arms and legs
removed (Higgsfield GPT Image 2.6, medium, 1k: 0.5 credits). The face, arms and legs stay vector so they can act.
The constants below were measured on that render; re-measure them if you make a new one:
  CX, BOT  centre x of the whistle and bottom of the pot (px)      -> rig (500, 770)
  TOP      top of the whistle (px)                                -> rig y 244 (same height as the vector rig)
  GASKET   last row of the lid rim, just above the scarf (px)
  HANDLE   the long handle (x < 240, y < 505) travels with the lid
Paste the printed numbers into SPR in src/Seetu.tsx.
"""
import json
import os
import sys

import numpy as np
from PIL import Image

CX, BOT, TOP, GASKET = 525.0, 886.0, 149.0, 463.0
S = (770 - 244) / (BOT - TOP)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "seetu3d")

a = np.array(Image.open(sys.argv[1]).convert("RGBA")).astype(np.float32)
H, W = a.shape[:2]
yy, xx = np.mgrid[0:H, 0:W]
lid = np.clip((GASKET - yy) / 2.0 + 0.5, 0, 1)  # 2 px soft cut
lid = np.maximum(lid, ((xx < 240) & (yy < 505)).astype(np.float32))
os.makedirs(OUT, exist_ok=True)
meta = {}
for name, m in (("lid", lid), ("body", 1 - lid)):
    b = a.copy()
    b[:, :, 3] *= m
    img = Image.fromarray(b.clip(0, 255).astype(np.uint8), "RGBA")
    x0, y0, x1, y1 = img.getchannel("A").point(lambda v: 255 if v > 2 else 0).getbbox()
    x0, y0, x1, y1 = max(0, x0 - 2), max(0, y0 - 2), min(W, x1 + 2), min(H, y1 + 2)
    img.crop((x0, y0, x1, y1)).save(os.path.join(OUT, f"{name}.png"), optimize=True)
    meta[name] = {k: round(v, 2) for k, v in zip("xywh", (500 + (x0 - CX) * S, 770 + (y0 - BOT) * S, (x1 - x0) * S, (y1 - y0) * S))}
print(json.dumps(meta))
