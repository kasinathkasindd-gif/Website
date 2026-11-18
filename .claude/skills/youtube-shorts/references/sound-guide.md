# Sound guide (operational)

The full rationale is in `what-india-eats/05-sound/sound-guide.md`.

## Brand sounds (fixed, never change)
- **Three-Whistle Sting (1.6–2.2 s):** a hiss build, then whistles on **G5 (784 Hz) → B5 (988 Hz) → D6 (1,175 Hz, vibrato 5.5 Hz ±20 c)**, then a steel "ting" (G6 + D7).
  - Prototype: `scripts/sting.py out.wav` (0 credits).
  - The final version should be a recorded real cooker whistle pitch-corrected to the same notes.
- **Hook whistle:** a single short whistle at 0.0 s.
- **Meal counters:** one rising note per meal (G5 after breakfast, B5 after lunch, D6 after dinner). The closing sting then plays all three. A diegetic "cousin" cooker whistles lower (~660 Hz) and breathier, so it isn't mistaken for a counter.
- **Full pilot sound library:** `what-india-eats/pilot/scripts/make_audio.py`.
- **Rocket Mode:** `scripts/sting.py out.wav --rocket`. Whistle 3 holds and glides up a fifth into a whoosh.

## Music beds (instrumental only)

| Bed | Tempo | Palette | Level under VO |
|---|---|---|---|
| Breakfast | 90–96 BPM | Plucks, shaker, birds | −22 LUFS |
| Lunch | 104–112 BPM | Hand drums, bass pluck | −22 LUFS |
| Dinner | 76–84 BPM | Breathy flute pad, drone, bells | −24 LUFS |
| Fact | — | Duck the music by −8 dB; riser + whomp + ding | — |
| Cliffhanger | 120 BPM | Train-chug build, cut on the sting | — |

- **Regional colour:** at most one timbre per season.
- **Never** use sacred or ritual music, or chants.

## Sources, in order of preference
1. **Original library** (made once, used on every platform).
2. **Higgsfield ElevenLabs Music v2.5** (~4.36 credits per 30 s). Check the licence terms of the user's plan first.
3. **YouTube Audio Library.** YouTube-only. Creative Commons tracks need attribution in the description. **Don't cross-post them.**
4. **Pixabay.** Keep the licence certificate; Content ID claims happen.
5. **Never** use copyrighted songs, "no copyright" re-uploads or film-song remixes.

## SFX
- **Record first:** the real cooker, coconut scraper, mortar, mustard seeds popping in hot oil, pours, steel clinks.
- **Otherwise:** Freesound **CC0 only**, or Higgsfield Mirelo SFX (~0.5 credits per 2 s) for hard ambiences.
- **Synthesise UI sounds in numpy:** whoosh = noise through a moving band-pass; pop = short pitch-dropping sine; ding = decaying sine pair; stamp = low thump + click.
- Peak-normalise every file to −1 dBFS.

## Mix
- **Levels:**
  - VO: 0 dB reference
  - Hits and splashes: −5 to −13 dB
  - Whooshes: −19 to −25 dB
  - Ambience: −27 dB, ducked under the VO
- **Master:** about −14 LUFS integrated, ≤ −1 dBTP true peak. Use the same master for YouTube, Instagram and Facebook.
- **Check:** `ffmpeg -i final.mp4 -af loudnorm=print_format=summary -f null -`

## Voice
- **Preferred:** a human recording (the user or a hired actor). Process it with +1–2 semitones, HPF at 90 Hz, +2 dB at 4 kHz, 3:1 compression and a de-esser.
- **AI option:**
  - `create_voice` once, from a consenting speaker's 30–60 s in-character recording.
  - Then each episode: `generate_audio` with `qwen_audio_tts`, `voice_type: element`, `voice_id: <seetu>`, `language: en`.
  - Instruction: `warm, playful, curious; light Indian English accent; medium-fast; smiling; slow down on food names`.
  - Cost: ~0.21 credits per 45 s.
  - Fallback: `text2speech_v2` with `variant: elevenlabs` (~1.5 credits).
- **Never** clone or imitate a real person or celebrity without written consent. Never use a caricature accent.
- **Pronunciation:** respell local names in the TTS text. Re-render only the broken phrase and splice it in. The reviewer signs off.
- **Timing:** measure it with `scripts/pauses.py vo.wav` (silence-based phrase boundaries), then write `timing.ts`. All animation keys off the measured times.
