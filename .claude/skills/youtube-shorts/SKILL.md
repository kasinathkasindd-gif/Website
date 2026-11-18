---
name: youtube-shorts
description: Produce a fact-checked, low-credit 9:16 YouTube Shorts series end to end — research and verify, script, generate assets on Higgsfield, voice, animate in Remotion, QA, upload and cross-post. Default series is "What India Eats" (one Short per Indian district, breakfast→lunch→dinner, hosted by the original mascot Seetu the pressure cooker), but every stage is reusable for any fact-based Shorts series. Use when the user asks for the next episode, a district/state episode, research for an episode, a script, assets, voice, an edit, an upload pack, a season plan, or says "What India Eats" or "Seetu".
---

# YouTube Shorts series skill (v0.2: plan approved, vector-first pilot built)

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
8. **Vector-first.** Draw the character, scenes and food in code at 0 credits (template: `what-india-eats/pilot/`). AI generation is optional and always quoted first.
9. **Stop at gates.** The user approves:
   - the hero character design
   - each state's data table
   - each batch's credit quote
   - the first cut of each new season before publishing

## Stage map

| Stage | Do | Output | Reference |
|---|---|---|---|
| 0. Setup check | Read the series bible; check the Higgsfield balance (`balance`); confirm the episode's place in the route and the district counter | Episode folder created | `references/data-schema.md` |
| 1. Research | Lock the state's district list (LGD export + notifications since); find a state baseline; run district searches by source tier | Rows in `research/<state>-food-table.csv` | `references/verification-checklist.md` |
| 2. Verify | 2-independent-source rule; contradiction pass; sensitivity pass; local reviewer sign-off where needed | Every row has a status + Data basis + sources | `references/verification-checklist.md` |
| 3. Script | Fill the fixed episode template; 115–130 words; fact-check table with row IDs; variety rule (change ≥3 of 6 elements vs the last episode) | `scripts/epNNN-<district>.md` | `references/episode-template.md` |
| 4. Assets | **Vector-first:** reuse the Seetu rig (`pilot/src/Seetu.tsx`) and draw new scenes and food as SVG components from the data-table descriptions (0 credits). Generate AI stills only if the user wants painted close-ups; then quote → approve → batch → save prompts and job ids | `src/scenes/*.tsx` (+ `prompts.md` if AI is used) | `references/character-bible.md`, `references/low-credit-rules.md` |
| 5. Voice | Human recording (preferred) or cloned voice through Qwen TTS; pronunciation respellings; measure timings | `vo/take1.wav` + `timing.ts` | `references/sound-guide.md` |
| 6. Edit / animate | Copy `what-india-eats/pilot/` as the template: `Ep001.tsx` (shots + caption cues + sound cues), `make_audio.py` (original sounds), `render.cjs` (stills / preview / final). Keep faces and food out of the caption band (y ≈ 1250–1460) and text out of the bottom 20% and right 12% | Preview 540×960 | `what-india-eats/pilot/README.md` |
| 7. QA | Fact-check table re-read against the final cut. Then: contact sheet of key stills; pop scan (`ffmpeg select='gt(scene,0.18)'`, only at planned cuts); safe zones; caption sync; master with `scripts/master.py` (−14 LUFS, ≤ −1.5 dBTP) | Final 1080×1920 MP4 | `references/verification-checklist.md` §QA |
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

## Higgsfield tools this skill uses (names as of Nov 2026; re-check each tool's schema before use)

- **Pricing:** `estimate_image_cost`, `estimate_audio_cost`, `estimate_video_cost`, `balance`
- **Stills:** `generate_image` (hero), `generate_image_batch` (≤12 per call), `remove_background`, `upscale_image`
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
  - 45 s target (35–55 s).
  - Hook 0–2 s → arrival → breakfast → lunch → dinner → unique fact → cliffhanger.
  - Whistle counts 1/2/3 mark the meals; the Steam-o-meter (0–3 puffs) rates spice.
  - "Three whistles — done!" closes every episode.
- **Cost:** vector-first ≈ **0 credits per episode** (0.21 if an AI voice clone is used). The AI-image tiers (Lean ≈ 3.9 / Standard ≈ 8.4 / Premium ≈ 17.4) apply only if the user opts into painted stills. Re-quote every batch.
- **Whistle notes:** breakfast G5, lunch B5, dinner D6; the closing sting plays all three.
