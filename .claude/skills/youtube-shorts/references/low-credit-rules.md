# Low-credit rules

## Default: code-first, pay only for the voice (≈ 0.55 credits per episode)
Draw scenes, food, UI and diagrams in code (SVG/React) and synthesise music and placeholder SFX in numpy. Seetu is 2.5D: two 3D-rendered layers made once (lid, body) plus a vector face, arms and legs, so every expression and the lip-flap are free. The per-episode spend is the voice (~22 Qwen lines × 0.02). Everything else is optional and quoted.

**Proven on EP001 (19 Nov 2026):** the whole 3D + voice + real-SFX test cost **9.07 credits** (quote was 82). See `what-india-eats/06-production/3d-and-voice-budget.md` §0.

## Gates
1. **Quote before every batch.** Call `estimate_*_cost` for each request and sum the results. Show the user the total and the line items. Wait for an explicit "yes".
   - **Standing approval:** when the user has set a tier and budget (e.g. "Lean, 200 credits"), batches inside that plan go ahead without a new yes each time. Still quote anything outside the plan, and report the spend at the end.
2. **Never** opt into free-trial or "unlim" balances without asking. **Never** auto-retry a generation whose outcome is unknown: check the job ids first.
3. **Log every job** in `prompts.md`: prompt, model, settings, job id, credits. Reconcile against `transactions` at the end of each state.

## Defaults (quoted 18 Nov 2026; re-quote, because prices change)

| Need | Use | Credits |
|---|---|---|
| Draft still | `gpt_image_2_6`, low, 1k | 0.25 |
| Final transparent sprite or dish | `gpt_image_2_6`, medium, **1k**, 1:1, `background: transparent` (2k only for hero art) | 0.5 (2k: 1.0) |
| Background 9:16 | `gpt_image_2_6`, medium, 1k–2k | 0.5–1.0 |
| Voice (per line, with an emotion instruction) | `qwen_audio_tts`, preset **Leo** `73a45c18-0c56-4642-a61e-f6b303f8ded1` | **0.02 / line** (~0.44 / episode) |
| 3D model of a prop or character (GLB) | `sam_3_3d` (Tripo H3.1 is 9) | **1.0** |
| Voice fallback | `text2speech_v2` (elevenlabs) | ~1.5 |
| SFX (hard ones only) | `mirelo_text_to_audio`, 2 s | 0.5 |
| Music bed (one-time library) | `elevenlabs_music_v2_5`, 30 s | ~4.36 |
| Optional hero motion | `veo3_1_lite`, 4 s, 9:16, no audio | 6 |

## Rules
1. **Stills plus code motion by default.** AI video is only for a single, ≤4 s hero shot, Premium tier only, ≤1 per episode, and only after the script is final.
2. **Generate once, reuse forever:**
   - the pose library (20)
   - kitchens per culinary region (2 each)
   - vehicles, props, music beds, the sting and SFX
   - Faces, steam, cards, maps and diagrams are SVG in code (0 credits).
3. **Batch by state:** all the state's dish stills in one session with locked style blocks. Use `generate_image_batch` / `generate_audio_batch` (≤12 per call), then `jobs_wait`.
4. **Draft at 0.25, finalise at 1.0.** Only keepers get the medium/2k render or an upscale.
5. **Reuse regional kitchens** across a state's districts and swap props in code.
6. **Edits are free.** Timing, text, music, camera and gags change in Remotion, never by regenerating.
7. **Fix with the cheapest tool.** Small artefacts get `remove_background` or a cheap inpaint, not a full regenerate.
8. **Budget tiers per episode** (measured on EP001, +20% retakes):

| Tier | What is paid | Credits per episode | Per 10 episodes |
|---|---|---|---|
| **Lean** | voice lines | **≈ 0.55** | ≈ 5.5 |
| Lean+ | + 1 new real SFX (Mirelo) | ≈ 1.15 | ≈ 11.5 |
| Standard | + 3 AI dish close-ups + 1 AI backdrop (1k) | ≈ 3.55 | ≈ 35.5 |
| Premium | Standard + one 4 s AI hero shot | ≈ 11 | ≈ 110 |

The whole 793-episode series at Lean ≈ 436 credits. SFX are a library: wind, ladle, churn, pour, jeep and stove are already paid for.
9. **Stop and report** if a batch would push the month's spend past the user's stated budget.
10. **Rate limits cost nothing but time.** Qwen TTS and Mirelo accept about 2 jobs at once; submit in pairs, wait, repeat. A 429 creates no job and no charge.
