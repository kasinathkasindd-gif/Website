# Phase 6: Lowest-credit production plan

All prices below were **quoted live from your Higgsfield account on 18 Nov 2026** using the cost-estimate tools. **No credits were spent.** Prices change, so the skill re-quotes before every batch.

## 1. Price sheet (what one call costs)

| Purpose | Model (Higgsfield id) | Settings | Credits |
|---|---|---|---|
| **Stills: default** | GPT Image 2.6 (`gpt_image_2_6`) | low, 1k | **0.25** |
| Stills: backgrounds | GPT Image 2.6 | medium, 1k, 9:16 | **0.5** |
| **Stills: character poses, dishes (transparent)** | GPT Image 2.6 | medium, 2k, 1:1, transparent bg | **1.0** |
| Stills: hero quality | GPT Image 2.6 | high, 2k, 9:16 | 2.75 |
| Alternatives | Nano Banana 2.1 (1k) / Nano Banana Pro (2k) / FLUX 3 (1k) | — | 1.5 / 2.0 / 2.0 |
| **Voice: cheapest** | Qwen Audio 3.0 TTS (`qwen_audio_tts`) | ~80-word script | **0.21** |
| Voice: ElevenLabs | Text-to-Speech v2, ElevenLabs engine | ~80-word script | 1.5 |
| Voice: Seed Audio | `seed_audio` | ~80-word script | 3.3 |
| SFX | Mirelo SFX | 2 s | 0.5 |
| Music | ElevenLabs Music v2.5 | 30 s instrumental | 4.36 |
| Video: cheapest | Veo 3.1 Lite (`veo3_1_lite`) | 4 s, 9:16, no audio | **6** |
| Video | Kling 3.0 (`kling3_0`) | std, 5 s, sound off | 7.5 |
| Video | Seedance 2.5 | 5 s, 480p / 720p, no audio | 15 / 35 |
| Video | FLUX 3 Video | 5 s, 720p, no audio | 30 |

## 2. Image + motion vs. full video generation: when to use which

| Use **image + code motion** (Remotion) for… | Use **AI video** only for… |
|---|---|
| Everything by default: the character, kitchens, dishes, maps, facts, gags. Generated **stills** (≈1 credit) are animated in code with exact timing, 0 credits per edit, and the same character every time. | **Optional "hero" moments** where real physical motion sells the shot and code can't fake it: tea poured from a height, a sizzling tadka splash. **Max 1 clip per episode, max 4 s, Veo 3.1 Lite (6 credits)**, and only when an episode's analytics show the extra is worth it. |

Why stills-first is right for this series:
- **Cost.** A 45 s Short as full AI video is about 9 clips × 5 s, which is 70–315 credits before retries. As stills plus code it is **4–10 credits**.
- **Accuracy.** Food must look right. A still is easy to check against reference photos and fix. AI video can drift: wrong dish shapes, extra fingers, melting pots.
- **Consistency.** Video models drift on the character. Code-animated sprites never do.
- **Policy.** A clearly animated style needs no AI-disclosure label (P06), while photorealistic AI video does (P07).

## 3. Generate ONCE and reuse (the asset library)

| Asset | Count | Credits each | One-time total |
|---|---|---|---|
| Seetu hero design (4 variants to choose from) + 2 revision rounds | 8 | 1.0 | 8 |
| Seetu pose library (character bible §13), +25% retries | 20 → 25 | 1.0 | 25 |
| Culinary-region kitchen sets (wide + counter), **first 6 seasons' regions** | 6 × 2 | 1.0 | 12 |
| Transport sprites (jeep, bus, canoe, train, ferry, auto, bike, ship) | 8 | 1.0 | 8 |
| Props (ladle-mic, jhola, map board, diary, stamp, banana leaf, thali, steel tumbler, clay pot, pressure cooker "cousin") | 10 | 0.5–1.0 | ~8 |
| Music library (9 beds × 30 s) *(optional: 0 if self-composed)* | 9 | 4.36 | ~39 |
| Hard SFX (fire crackle, water, tadka, wind) *(optional: 0 if recorded)* | 8 | 0.5 | 4 |
| Custom Seetu voice (Create Voice) | 1 | quote at the time | — |
| **Total** | | | **≈ 61 credits lean (own music + SFX), ≈ 104 with generated audio** |

Later seasons add about 2 credits per new culinary region (about 15–20 regions in total, so roughly 30 more credits over the whole series).

Mouths, blinks, brows, steam, the Steam-o-meter, cards, maps and diagrams are **drawn in code (SVG): 0 credits forever.**

## 4. Per-episode cost

| Line | Lean | Standard | Premium |
|---|---|---|---|
| District establishing background | 0 (reuse regional) | 1 | 1 |
| Dish stills (3 meals) | 3 × 1.0 | 3 × 1.0 + 1 extra prop | 3 × 1.0 + 2 extra |
| Voice | 0.21 (Qwen, cloned voice) | 1.5 (ElevenLabs) | 1.5 |
| Special SFX | 0 | 0.5 | 1 |
| AI hero video clip | — | — | 6 (Veo 3.1 Lite, 4 s) |
| Retry buffer | +20% | +20% | +20% |
| **Per episode** | **≈ 3.9** | **≈ 8.4** | **≈ 17.4** |
| **Per 10 episodes** | **≈ 39** | **≈ 84** | **≈ 174** |
| First episode in a new region | +2 (kitchen set) | +2 | +2 |

For comparison, the same 10 episodes as **full AI video** (9 Kling std clips of 5 s each, +30% retries, plus voice) would cost about **890 credits**: about 10× the Standard tier and 23× the Lean tier.

**Recommendation:** run **Standard** for the first 20 episodes, so voice quality and dish detail help win early audience tests. Then move to **Lean** for most episodes, and keep **Premium** for season openers and the episodes that do best.

## 5. Batching tips (cut credits and time further)

1. **Batch by state, not by episode.**
   - Research and verify the whole state.
   - Write all its scripts.
   - Then generate all of the state's dish stills in one session: same style block, same reference images, and fewer re-rolls because the style stays locked.
2. **Use the batch tools.**
   - Images: `generate_image_batch` for up to 12 independent prompts per call.
   - Voice: `generate_audio_batch` for up to 12 VO lines per call.
   - Then wait on all the jobs at once.
3. **Start at 1k and upscale only winners.** Draft dishes at **low/1k (0.25 credits)**. Re-render only the keepers at medium/2k (1 credit), or upscale. This saves about 40% on stills that get rejected anyway.
4. **Reuse by region.** One kitchen per culinary region with props swapped in code. Example: Kerala's 14 districts share one kitchen.
5. **Recipe-step shots are code, not images.** Ingredients flying into a pot, steam and bubbles are animated SVG over the dish still.
6. **Lock the prompts.** Use fixed CHAR / STYLE text blocks (skill reference) that are never rephrased, so a second attempt is rarely needed.
7. **Voice in one go.** Render a whole state's VO the same day, with the same voice element and the same settings, for consistent tone. Re-render single phrases only for pronunciation fixes.
8. **No credits for edits.** Timing, text, music, gags, colour and camera all live in Remotion code. Changing them costs 0 credits.
9. **Cap the AI video.** Max 1 clip per episode, Premium tier only, and only after the episode's script is final.
10. **Approve before spending.** Every batch is quoted first (`estimate_*_cost`) and needs a "yes" from you. The skill never spends credits silently.

## 6. Tooling (non-credit)

- **Animation and rendering:** Remotion 4 (React) for multiplane cut-out animation, rendered locally or in the cloud.
  - Remotion is free for individuals and very small companies; larger companies need a paid licence (check remotion.dev/license).
- **Audio:** numpy/ffmpeg for synthesised SFX and the sting; a DAW for the music beds.
- **QA:** contact sheets of stills at key times, a 540×960 preview render, then the final 1080×1920.
- **Storage:** keep every prompt, job id, cost and source in the episode folder (the skill does this), so any asset can be traced and regenerated.
