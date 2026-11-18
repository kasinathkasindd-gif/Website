# Low-credit rules

## Default: vector-first (0 credits)
Draw the character, scenes, food, UI and diagrams in code (SVG/React), and synthesise SFX and music in numpy. Spend credits only on what the user explicitly wants painted or voiced by AI.

## Gates
1. **Quote before every batch.** Call `estimate_*_cost` for each request and sum the results. Show the user the total and the line items. Wait for an explicit "yes".
2. **Never** opt into free-trial or "unlim" balances without asking. **Never** auto-retry a generation whose outcome is unknown: check the job ids first.
3. **Log every job** in `prompts.md`: prompt, model, settings, job id, credits. Reconcile against `transactions` at the end of each state.

## Defaults (quoted 18 Nov 2026; re-quote, because prices change)

| Need | Use | Credits |
|---|---|---|
| Draft still | `gpt_image_2_6`, low, 1k | 0.25 |
| Final transparent sprite or dish | `gpt_image_2_6`, medium, 2k, 1:1, `background: transparent` | 1.0 |
| Background 9:16 | `gpt_image_2_6`, medium, 1k–2k | 0.5–1.0 |
| Voice | `qwen_audio_tts` with the Seetu voice element | ~0.21 / 45 s |
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
8. **Budget tiers per episode** (with a +20% retry buffer):

| Tier | Credits per episode | Credits per 10 episodes |
|---|---|---|
| Lean | ≈ 3.9 | ≈ 39 |
| Standard | ≈ 8.4 | ≈ 84 |
| Premium | ≈ 17.4 | ≈ 174 |

A new culinary region adds about 2 credits for its kitchen. One-time setup costs about 61 credits (own audio) or about 104 (generated audio).
9. **Stop and report** if a batch would push the month's spend past the user's stated budget.
