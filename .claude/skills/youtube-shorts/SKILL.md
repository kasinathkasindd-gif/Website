---
name: youtube-shorts
description: Produce a fact-checked, low-credit 9:16 YouTube Shorts series end to end — research and verify, script, generate assets on Higgsfield, voice, animate in Remotion, QA, upload and cross-post. Default series is "What India Eats" (one Short per Indian district, breakfast→lunch→dinner, hosted by the original mascot Seetu the pressure cooker), but every stage is reusable for any fact-based Shorts series. Use when the user asks for the next episode, a district/state episode, research for an episode, a script, assets, voice, an edit, an upload pack, a season plan, or says "What India Eats" or "Seetu".
---

# YouTube Shorts series skill (v0.4 draft: EP002 built with the EP001 review fixes; awaiting approval)

This skill runs **one pipeline**: research → verify → script → assets → voice → edit → QA → upload → learn.

Accuracy comes first, then virality, then cost. When they conflict, follow that order.

## Hard rules (never break)

1. **No unverified fact on screen.**
   - *Verified* facts may be stated flatly.
   - *Partially verified* facts must be phrased regionally ("Across central Kerala…", "Many homes…").
   - *Unverified* items are cut, or asked as a question to viewers.
2. **Never invent a dish, price, number or local-language word.** Unknown native-script spellings stay as `[reviewer to supply]`.
3. **Never spend credits without a quote and an explicit "yes".**
   - Quote every batch with `estimate_image_cost` / `estimate_audio_cost` / `estimate_video_cost`, show the total, and wait for the user.
   - A standing approval ("Lean, 200 credits") covers batches inside that plan; anything outside it is quoted first. Report the spend after.
   - Don't take a free-trial or "unlim" choice on the user's behalf.
4. **Original or properly licensed audio only.** No copyrighted songs. YouTube Audio Library "standard" tracks are YouTube-only, so don't cross-post them.
5. **Keep it clearly animated.** If any photorealistic AI footage is used, tick *altered or synthetic content* at upload.
6. **Respect the culture rules:**
   - No caricature accents.
   - No "weird/gross/exotic".
   - No religious or political costumes or symbols as gags.
   - Name communities only as sources do.
   - Festival food is labelled as festival food.
7. **No national-border maps of India** unless they use official Survey of India boundaries. Use abstract route graphics instead (as the pilot does).
8. **Code-first.** Scenes, food, UI and music are code (0 credits). Seetu is 2.5D: the 3D-rendered lid and body layers (made once) plus a vector face, arms and legs, so expressions and lip-flap are free. Per episode, pay only for the voice unless the user opts into more (template: `what-india-eats/pilot/`).
9. **Stop at gates.** The user approves:
   - the hero character design
   - each state's data table
   - each batch's credit quote
   - the first cut of each new season before publishing
10. **Every voice line is transcribed before the edit** (TTS drops words), and the captions must match the voice word for word.

## Stage map

| Stage | Do | Output | Reference |
|---|---|---|---|
| 0. Setup check | Read the series bible; check the Higgsfield balance (`balance`); confirm the episode's place in the route and the district counter | Episode folder created | `references/data-schema.md` |
| 1. Research | Lock the state's district list (LGD export + notifications since); find a state baseline; run district searches by source tier | Rows in `research/<state>-food-table.csv` | `references/verification-checklist.md` |
| 2. Verify | 2-independent-source rule; contradiction pass; sensitivity pass; local reviewer sign-off where needed | Every row has a status + Data basis + sources | `references/verification-checklist.md` |
| 3. Script | Fill the fixed episode template; 115–130 words; fact-check table with row IDs; variety rule (change ≥3 of 6 elements vs the last episode) | `scripts/epNNN-<district>.md` | `references/episode-template.md` |
| 4. Assets | **Code-first:** reuse Seetu (`pilot/src/Seetu.tsx`, `sprites` mode = 3D layers) and draw new scenes and food as SVG components from the data-table descriptions (0 credits). Reuse the SFX library. AI dish stills only if the user opts in; then quote → approve → batch → log job ids | `src/scenes/*.tsx` (+ `prompts.md` if AI is used) | `references/character-bible.md`, `references/low-credit-rules.md`, `what-india-eats/library/seetu/3d/README.md` |
| 5. Voice | One Qwen TTS line per caption cue (Leo, `speech_rate` 1.0), each with its own emotion instruction (≤ 128 chars); respell names; submit 2 at a time; transcribe every line; retake any that drop or blur words (≈ 0.02 credits each) | `VO_DIR/00.wav…NN.wav` | `references/sound-guide.md` |
| 6. Edit / animate | New folder `pilot/src/epNNN/`: `timing.json` (cues, story-beat events, shots, pace) + `EpNNN.tsx` (shots and sound cues in script time, on the shared `engine.tsx`: `Episode`, `Cam`) + `art.tsx` for new scenery and food; register it in `Root.tsx`. Follow the **motion rules** (no frozen frames). Fit to the voice with `build_timing.py --config src/epNNN/timing.json --tempo 1.10 --max-pause 0.30 --sprites`, render with `EP_COMP=… EP_PROPS=… node scripts/render.cjs final`. Keep faces and food out of the caption band (y ≈ 1250–1460) and text out of the bottom 20% and right 12% | Final 1080×1920 | `what-india-eats/pilot/README.md`, `references/episode-template.md` |
| 7. QA | Fact-check table re-read against the final cut. Then: contact sheet of key stills; **`pilot/scripts/qa_motion.py final.mp4` must show no still stretch > 0.5 s and no glitch frame**; speech-to-text of the final mix (every line present, in order); safe zones; caption sync; master with `scripts/master.py` (−14 LUFS, ≤ −1.5 dBTP) | Final 1080×1920 MP4 | `references/verification-checklist.md` §QA |
| 8. Upload | Title / description / sources / hashtags / pinned question / playlist / related video / disclosure; then IG + FB native uploads | Upload pack `upload.md` | `references/upload-checklist.md` |
| 9. Learn | After 48 h and 7 days: retention graph, swipe-away rate, top geographies, comments → corrections queue | `log.md` row | `references/upload-checklist.md` §Learn |

## Episode folder layout

```
series/what-india-eats/
  research/<state>-food-table.csv      # one row per district × meal (schema: references/data-schema.md)
  research/sources.md                  # numbered sources, tiers, URLs
  episodes/epNNN-<district>/
    script.md                          # beat sheet + fact-check table + clean VO + upload pack
    prompts.md                         # every generation prompt + job id + credits
    assets/  vo/  sfx/                 # raw files
    render/  preview.mp4  final.mp4
  library/                             # reusable poses, kitchens, vehicles, props, music, sting
  log.md                               # spend, publish dates, analytics, corrections
```

## Where to render

If this session can download Higgsfield results (the CDN host is allowed), render locally. If not, render **in Higgsfield's sandbox** (`sandbox_exec`), which can:
1. `git clone` the public repo branch and `npm ci` in `what-india-eats/pilot` (~20 s);
2. `curl` the generation result URLs into `VO_DIR` / `SFX_DIR`, run `cut_sprites.py`, `apply_ai_sfx.py`, `build_timing.py`;
3. render with `EP_PROPS` (the XL sandbox has 4 CPUs: a 58 s 1080×1920 cut takes ~6 min; run it in the background, poll with sleeps under 45 s);
4. master with `master.py`, then `media_upload` → `curl -X PUT --upload-file` in the same command → `media_confirm`, so the final lands in the user's Higgsfield library.
Commit code from this session and pull it in the sandbox. Keep CDN URLs (they contain the user's account id) out of the public repo; store job ids instead.

## Higgsfield tools this skill uses (names as of Nov 2026; re-check each tool's schema before use)

- **Pricing:** `estimate_image_cost`, `estimate_audio_cost`, `estimate_video_cost`, `balance`
- **Stills:** `generate_image` (hero), `generate_image_batch` (≤12 per call), `remove_background`, `upscale_image`
- **3D:** `generate_3d` with `sam_3_3d` (1 credit; GLB for turnarounds and thumbnails). Preflight with `get_cost: true`
- **Sandbox:** `sandbox_exec` (render, ffmpeg, faster-whisper QA), `media_upload` + `media_confirm` (deliver the final)
- **Voice:**
  - `create_voice` (one-time custom voice from a consenting speaker)
  - `generate_audio` / `generate_audio_batch` with `qwen_audio_tts` (cheapest) or `text2speech_v2` (ElevenLabs engine)
  - `list_voices` to audition presets
- **SFX and music:** `generate_audio` with `mirelo_text_to_audio` (SFX) and `elevenlabs_music_v2_5` (music)
- **Optional hero clip:** `generate_video` with `veo3_1_lite` (4 s). Premium tier only, ≤1 per episode
- **Waiting and display:** `jobs_wait`, `show_generation_by_ids`

## Defaults for the What India Eats series

- **Route:** clockwise journey (Ladakh → … → Madhya Pradesh). The counter shows "District N / 793", where 793 = 791 administrative districts plus Mahé and Yanam (as of 18 Nov 2026). Re-check the counts before each season.
- **Format:**
  - 50–60 s. At the EP002 pace (≈ 2.1 words/s while talking) write 90–110 words (EP002: 109 words, 60 s).
  - Hook 0–2 s → arrival → breakfast → lunch → dinner → unique fact → cliffhanger.
  - Whistle counts 1/2/3 mark the meals; the Steam-o-meter (0–3 puffs) rates spice.
  - "Three whistles — done!" closes every episode.
- **Cost (measured on EP001):** Lean ≈ **0.55 credits per episode** (the voice lines); Lean+ ≈ 1.15 (+1 real SFX); Standard ≈ 3.55 (+3 AI dish close-ups and a backdrop). 191 credits ≈ 347 Lean episodes. Re-quote every batch.
- **Voice:** Seetu = Qwen preset Leo; host characters = Mark. Respellings that pass speech-to-text: See-too, Lay (Leh), goor-goor cha, kham-beer, kho-lak, took-pa, Chang-tang, daal.
- **Whistle notes:** breakfast G5, lunch B5, dinner D6; the closing sting plays all three.
