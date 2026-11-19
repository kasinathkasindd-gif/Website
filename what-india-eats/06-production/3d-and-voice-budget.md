# 3D Seetu + voice-over: credit budget

**Update 19 Nov 2026: the Lean test is done and paid for. It cost 9.07 credits, not the 82 quoted below.** Balance: 200.15 → **191.08**. Sections 1–5 are the original quotes from 18 Nov, kept for reference.

## 0. What was actually spent (live balance, 19 Nov 2026)

| Step | Model (Higgsfield) | Qty | Credits |
|---|---|---|---|
| Polished 3D-look Seetu, 4 variants (picked #1: front view, relaxed arms) | GPT Image 2.6, medium, 2k, transparent | 4 | 4.00 |
| Faceless, limbless pot: the input for 3D and the layers used in the video | GPT Image 2.6, medium, **1k**, transparent | 1 | 0.50 |
| 3D model (GLB: pot, lid, whistle, handle, scarf) | **SAM 3 3D Objects** (instead of Tripo H3.1 at 9) | 1 | 1.00 |
| Voice auditions (Leo vs Mark) | Qwen TTS | 2 | 0.04 |
| EP001 voice: 21 lines, one emotion each, plus 1 retake | Qwen TTS, voice **Leo** | 22 | 0.44 |
| Host's "Every day!" (a second voice) | Qwen TTS, voice Mark | 1 | 0.02 |
| Real sound effects: wind, ladle, butter-tea churn, tea pour, jeep, wood stove | Mirelo SFX, 2 s each | 6 | 3.00 |
| Rendering, timing, mastering, uploads | Higgsfield sandbox | — | 0.00 |
| **Total** | | | **≈ 9.07** |

Why it came in so far under the 82-credit quote:
- **No rigging.** Seetu is a pot on stick legs, so an auto-rig was a gamble. Instead the video uses **2.5D**: the polished render is cut into a lid layer and a body layer (so the lid still pops), while the face, arms and legs stay drawn in code. That keeps every expression and the lip-flap, for 0 credits per episode.
- **1-credit 3D model.** SAM 3 3D gave a clean, textured GLB of the pot for 1 credit (Tripo was 9). It is kept for turnarounds, thumbnails and future spin shots.
- **1k instead of 2k** for anything that is not a hero image (0.5 instead of 1.0).

What you get from it: `pilot/` renders **EP001 with 3D Seetu, a situational voice-over (one emotion per line), lip-flap, a host voice, real SFX, ducked music, and captions synced to the voice**. Length is 58 s, because a real voice at a natural 2.8 words/s is slower than the 46 s silent cut.

**Rate limits seen:** Qwen TTS accepts about 2 jobs at a time (submit in pairs; a 429 costs nothing). Mirelo took 2 at a time.

## 6. How far the remaining credits go (191 after EP001; 189.67 after EP002)

Per-episode cost from EP001's real numbers, confirmed by EP002 (1.41 credits = Lean+ with 2 new SFX; its voice alone was ≈ 0.4). Seetu (3D layers + vector face), scenes, food, music and the sound library are reused, so they cost 0.

| Tier | What is paid per episode | Credits / episode (incl. +20% retakes) | Episodes from 191 credits | Route reached (complete seasons) |
|---|---|---|---|---|
| **Lean (recommended)** | ~22 voice lines with emotion | **≈ 0.55** | **≈ 347** | Ladakh → … → **Mizoram**: **17 states/UTs** (345 episodes) |
| Lean+ | Lean + 1 new real SFX | ≈ 1.15 | ≈ 166 | Ladakh → **Uttarakhand** (8 seasons, 113) + 53 of Uttar Pradesh's 75 |
| Standard | Lean+ + 3 AI dish close-ups + 1 AI backdrop (1k, 0.5 each) | ≈ 3.55 | ≈ 53 | Ladakh, J&K, Himachal (3 seasons, 40) + 13 of Punjab |

Route totals used (cumulative episodes): Ladakh 8 · J&K 28 · Himachal 40 · Punjab 63 · Chandigarh 64 · Haryana 87 · Delhi 100 · Uttarakhand 113 · Uttar Pradesh 188 · Bihar 226 · Jharkhand 250 · West Bengal 273 · Sikkim 279 · Assam 314 · Meghalaya 326 · Tripura 334 · Mizoram 345 · Manipur 361 · Nagaland 378.

- **The whole series (793 episodes) at Lean ≈ 436 credits.** 191 credits cover about 44% of India.
- **Best value:** Lean everywhere, plus a small launch reserve. For example, keep ~15 credits for the first season (8 episodes) to add a real SFX or a dish close-up where a scene needs one. That still leaves ≈ 320 Lean episodes.
- **Time, not credits, is the limit.** One Lean episode a day costs ≈ 17 credits a month, so 191 credits last ≈ 11 months of daily uploads. Research is the real bottleneck: each district needs verified rows (2 sources) and a reviewer pass.

## 1. How the 3D version will work (so that each episode stays cheap)

1. **Polish.** An AI image model turns the approved vector Seetu into a polished, 3D-rendered-looking Seetu: front view, arms slightly out, a pose that rigs well.
2. **Convert.** Image-to-3D makes a textured 3D model (GLB).
3. **Rig + animate (bought once).** The 3D model gets a skeleton plus a small library of motion clips: idle, walk, wave, talk, jump, happy.
4. **Animate in code, for free, forever.** The 3D model is rendered inside our Remotion video (three.js).
   - The camera, timing, squash and stretch, lid-pop and steam are all code.
   - **Face:** Seetu's eyes, brows and mouth stay as drawn 2D layers on the front of the pot. That keeps all the expressions and lets the mouth move with the voice at 0 credits. A 3D model on its own would have one frozen face.
5. **Voice-over, matched to each moment.** Each line gets its own emotion: surprised for the hook, warm at breakfast, suspicious for "Every day…?", cosy at dinner, amazed for the fact.

**Risk to know about:** the auto-rigger is built for human-shaped bodies, and Seetu is a pot on stick legs. That's why the test runs in stages: **one rig + one clip first (8 credits)**, and the rest of the clips only if that works.

## 2. Live price list (credits)

| Item | Model | Credits |
|---|---|---|
| Polished 3D-look image | Nano Banana Pro, 2K | 2.0 each |
| Polished image (hero quality) | GPT Image 2.6, high, 2K, transparent | 2.75 each |
| Polished image (draft) | GPT Image 2.6, medium, 2K, transparent | 1.0 each |
| Image → 3D (cheapest good) | Tripo H3.1, textured + PBR, standard | **9** |
| Image → 3D (detailed) | Tripo H3.1, textured + PBR, detailed | 18 |
| Image → 3D (alternative) | Hunyuan3D v3, PBR | 15 |
| Image → 3D, all-in-one | Meshy 7, textured + PBR + rig + 1 animation | 47.5 |
| Rig an existing 3D model | Meshy rigging (no clip) | 5 |
| Rig + 1 animation clip | Meshy rigging + clip | **8** per clip |
| Voice, emotion per line | Qwen TTS (instruction per line) | **≈0.02 per line** (≈0.5 for a whole episode) |
| Voice, expressive | ElevenLabs v4 with emotion tags, whole 126-word script | 4.14 |
| Voice, standard | ElevenLabs (TTS v2 or v4 Turbo), whole script | 2.4 |
| Sound effect (realistic) | Mirelo SFX, 3 s | 0.75 each |
| Music bed (optional) | ElevenLabs Music v2.5, 30 s | 4.36 each |
| AI video shot (optional) | Kling 3.0 std 5 s / Veo 3.1 Lite 4 s | 7.5 / 6 |

## 3. Credits to TEST everything before saving the skill (one-time)

| Step | What | Lean | Recommended |
|---|---|---|---|
| T1 Polish | 4 polished variants (Nano Banana Pro) | 8 | 8 |
| | 1 revision round (2 images) | 4 | 4 |
| | Side + back views (better 3D shape) | — | 4 |
| T2 Convert to 3D | Tripo H3.1 detailed | 18 | 18 |
| | Second model to compare (Hunyuan3D v3) | — | 15 |
| T3 Rig + motion | 1 rig + 1 clip test (walk), go/no-go | 8 | 8 |
| | More clips: idle, wave, talk (Lean) / + jump, happy (Recommended) | 24 | 40 |
| T4 Voice | Audition 3–4 voices (one line each) | 1 | 1 |
| | Full pilot VO: Qwen with emotion per line | 0.5 | 0.5 |
| | Full pilot VO: ElevenLabs v4 expressive, to compare | — | 4.14 |
| | One retake of the winner | 0.5 | 4.14 |
| T5 Sound | 6 realistic SFX (churn, pour, wind, jeep, fire, ladle) | 4.5 | 4.5 |
| T6 Comparison | One 5 s AI video of 3D Seetu, to compare against our code animation | — | 7.5 |
| T7 Rebuild the pilot with 3D Seetu + voice | Done in code | 0 | 0 |
| | **Subtotal** | **68.5** | **118.8** |
| | **+20% retry buffer** | **≈ 82** | **≈ 143** |

- Optional extras: AI music beds (3 × 4.36 ≈ 13).
- Optional custom voice: cloned from a consenting speaker's 30–60 s recording. Higgsfield shows its price in the Create Voice window.

## 4. Credits per COMPLETE video after the skill is saved

Seetu's 3D model and motion clips are reused for free in every episode.

| Tier | What changes per episode | Credits / episode | Per 10 episodes | Ladakh season (8) |
|---|---|---|---|---|
| **Lean** | 3D Seetu + vector scenes and food + Qwen emotion voice | **≈ 0.6** | ≈ 6 | ≈ 5 |
| **Standard (recommended)** | + 3D-look AI stills for 3 dishes + 1 backdrop (1 credit each), + 1 realistic SFX | **≈ 6.3** | ≈ 63 | ≈ 50 |
| **Expressive** | Standard, with ElevenLabs v4 expressive voice instead of Qwen | **≈ 11** | ≈ 110 | ≈ 88 |
| **Premium** | Expressive + one 5 s AI video hero shot | **≈ 20** | ≈ 200 | ≈ 160 |

All tiers include the +20% retry buffer. Add 8 credits whenever an episode needs a new motion clip (rare).

## 5. What to buy on a limited budget

Higgsfield sells one-time top-up packs of **500 / 1,000 / 2,000 / 4,000 credits**; prices are shown at checkout.
- **Smallest useful amount:** about **90 credits** covers the Lean test.
- **A 500-credit pack** covers:
  - the **Recommended test (≈143)**
  - **plus about 55 Standard episodes**, or about **590 Lean episodes**, or a mix.

Order of spending (each step quoted and approved first):
1. T1 polish.
2. T2 convert.
3. T3 one rig + clip go/no-go.
4. The remaining clips.
5. T4 voice.
6. T5 sound.

If the rig fails, we stop after step 3, having spent ≈ 38 credits. The vector rig remains the fallback, at 0 credits.
