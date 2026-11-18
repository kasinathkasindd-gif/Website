# EP001 Leh: silent animatic (vector, 0 credits)

The approved pilot build, made entirely in code:
- Seetu vector rig
- Vector scenes and food
- Synthesised sound and music
- Captions carrying the approved script word for word

There is no narration yet; the voice choice was deferred until after review.

- **Watch:** `renders/ep001-leh-animatic.mp4` (1080×1920, 30 fps, 46 s, −14 LUFS)
- **Key frames:** `renders/ep001-contact-sheet.png`

## Rebuild

```bash
cd what-india-eats/pilot
npm install                      # Remotion 4.0.545 + React 19
python3 scripts/make_audio.py    # writes public/audio/*.wav (all original, synthesised)
node scripts/render.cjs stills   # key-frame PNGs in out/ (QA contact sheet)
node scripts/render.cjs preview  # 540×960 check
node scripts/render.cjs final    # 1080×1920
python3 scripts/master.py out/ep001-leh-animatic-1080x1920.mp4 renders/ep001-leh-animatic.mp4
```

Rendering uses the local Chrome headless shell, set as `BROWSER` in `scripts/render.cjs`. Change that path on another machine.

## Where things live

| File | What |
|---|---|
| `src/Seetu.tsx` | The animatable rig: expressions, arms, walk, lid-pop, steam. Approved design from `../library/seetu/` |
| `src/scenes/scenes.tsx` | Ladakhi kitchen, Leh exterior, jeep, route graphic, plateau, and the food props (butter tea, churn, kholak, khambir, thali, thukpa, sacks) |
| `src/ui/ui.tsx` | Captions, hook text, meal chip with whistle counter, Steam-o-meter, dish and fact cards, badges, speech bubble |
| `src/Ep001.tsx` | Timeline: 12 shots, caption cues (= approved VO), sound cue list |
| `scripts/make_audio.py` | Three-whistle sting, brand whistles (G5 / B5 / D6 = meals 1 / 2 / 3), SFX, 3 music beds |

## Deliberate choices
- **No map of India's borders.** The route is an abstract graphic. Any real India map must follow the official Survey of India boundaries before it is used.
- **Native-script dish names are left out.** Bhoti spellings await the Ladakhi reviewer, so cards show romanised name + English only.
- **Whistles count meals and steam rates spice.** Each meal ends on one rising note (G5, B5, D6); the closing sting plays all three.
- **Fonts:** Inter (SIL Open Font License), bundled in `public/fonts/`.
