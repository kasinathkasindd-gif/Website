# EP001 Leh: voiced 3D cut + silent animatic

**Voiced 3D cut (19 Nov 2026, Lean, 9.07 credits in total):** 3D-rendered Seetu, one emotion per voice line, lip-flap, a host voice, real SFX, captions synced to the voice. 58 s, 1080×1920, −14 LUFS.
- Rendered on Higgsfield's sandbox and saved to your Higgsfield library as `ep001-leh-voiced-3d-v2.mp4` (this cloud session can't download Higgsfield files, so the MP4 is not in the repo).
- How it is built: see **Voiced 3D cut** below.

## EP002 Changthang (19 Nov 2026): the review fixes

Built after the EP001 review ("delivery too fast", "animation freezes"):
- **Slower voice:** lines generated at `speech_rate` 1.0, fitted with `--tempo 1.10 --max-pause 0.30` → 2.1 words/s while talking (EP001: 2.8). 109 words, 60 s.
- **No frozen frames:** shared `src/engine.tsx` (`Cam` drift on every shot), Seetu breathes and bounces/nods with the voice, ambient motion in every scene, one visual beat per line. `scripts/qa_motion.py` checks the render (EP001 had 11 still stretches).
- Per-episode config: `src/ep002/timing.json` (cues, story beats, shots, pace) is read by both `Ep002.tsx` and `build_timing.py`.

```bash
python3 scripts/make_audio.py && python3 scripts/apply_ai_sfx.py SFX_DIR        # SFX_DIR adds yak + herd for EP002
python3 scripts/build_timing.py --config src/ep002/timing.json --vo VO_DIR --sprites --tempo 1.10 --max-pause 0.30 --props out/props_ep2.json
EP_COMP=Ep002Changthang EP_PROPS=out/props_ep2.json EP_OUT=ep002-raw.mp4 node scripts/render.cjs final
python3 scripts/master.py out/ep002-raw.mp4 out/ep002-changthang.mp4
python3 scripts/qa_motion.py out/ep002-changthang.mp4
```

## Silent animatic (18 Nov 2026, 0 credits)

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

Rendering uses a local Chrome headless shell (`REMOTION_BROWSER`, else the Playwright one, else Remotion downloads one).

## Voiced 3D cut

The same composition, driven by props: `{timing, sprites: true}`.

```bash
# 1. Assets (Higgsfield, quoted first; job ids in ../library/seetu/3d/README.md)
#    - faceless 3D-look render of Seetu  -> python3 scripts/cut_sprites.py faceless.png  (writes public/seetu3d/)
#    - one Qwen TTS file per caption cue -> VO_DIR/00.wav … 20.wav, host.wav
#    - Mirelo SFX (wind, ladle, churn, pour, jeep, fire) -> SFX_DIR/
python3 scripts/apply_ai_sfx.py SFX_DIR          # replaces the synthesised placeholders in public/audio/
python3 scripts/build_timing.py --vo VO_DIR --host VO_DIR/host.wav --tempo 1.15 --max-pause 0.22 --sprites
EP_PROPS=out/props.json node scripts/render.cjs stills 1,9.6,22,30,41,53   # QA frames
EP_PROPS=out/props.json EP_OUT=ep001-leh-voiced-raw.mp4 node scripts/render.cjs final
python3 scripts/master.py out/ep001-leh-voiced-raw.mp4 out/ep001-leh-voiced-3d.mp4
```

What `build_timing.py` does:
- Trims each line, shortens pauses inside it to ≤ 0.22 s, speeds speech by 1.15× (sox, pitch kept) and level-matches it.
- Places the lines one after another and keeps the story beats in order: a meal whistle only after its line, the host's "Every day!" before Seetu answers, the closing line after the three-whistle sting, and no line running over a shot cut.
- Writes a script-time → real-time map. Every shot plays through it (`useShotFrame`), so animation keys written for the 46 s script still land on the right words. On-screen action is never squeezed by more than 1.4×.
- Writes a per-frame mouth track from the voice loudness for Seetu's lip-flap.

`public/vo/` and `public/seetu3d/` are generated per run and git-ignored.

## Where things live

| File | What |
|---|---|
| `src/Seetu.tsx` | The animatable rig: expressions, arms, walk, lid-pop, steam, lip-flap. Vector, or 2.5D with the 3D-rendered lid/body layers (`sprites`) |
| `src/timing.ts` | Voice-driven timing: script→real time map, shot frame hooks |
| `src/scenes/scenes.tsx` | Ladakhi kitchen, Leh exterior, jeep, route graphic, plateau, and the food props (butter tea, churn, kholak, khambir, thali, thukpa, sacks) |
| `src/ui/ui.tsx` | Captions, hook text, meal chip with whistle counter, Steam-o-meter, dish and fact cards, badges, speech bubble |
| `src/Ep001.tsx` | Timeline: 12 shots, caption cues (= approved VO), sound cue list |
| `scripts/make_audio.py` | Three-whistle sting, brand whistles (G5 / B5 / D6 = meals 1 / 2 / 3), SFX, 3 music beds, stove crackle |
| `scripts/build_timing.py` | Fits the edit to a real voice-over (see above) |
| `scripts/cut_sprites.py` | Cuts the faceless 3D render into lid and body layers |
| `scripts/apply_ai_sfx.py` | Drops real AI SFX over the synthesised placeholders |

## Deliberate choices
- **No map of India's borders.** The route is an abstract graphic. Any real India map must follow the official Survey of India boundaries before it is used.
- **Native-script dish names are left out.** Bhoti spellings await the Ladakhi reviewer, so cards show romanised name + English only.
- **Whistles count meals and steam rates spice.** Each meal ends on one rising note (G5, B5, D6); the closing sting plays all three.
- **Fonts:** Inter (SIL Open Font License), bundled in `public/fonts/`.
