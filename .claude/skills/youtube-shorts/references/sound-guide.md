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
- **AI option (in use for EP001):**
  - `generate_audio_batch` with `qwen_audio_tts`, `voice_type: preset`, `voice_id: 73a45c18-0c56-4642-a61e-f6b303f8ded1` (Leo), `language: en`, `format: wav`, `sample_rate: 48000`, `speech_rate` 1.05–1.15.
  - **One request per caption line**, each with its own `instruction` for the moment, e.g. "Shocked, delighted disbelief, high energy" (hook), "Cosy, soft and warm, evening calm" (dinner), "Suspicious and playful, a teasing question" (Every day…?). End every instruction with "light natural Indian English accent".
  - Only Leo and Mark worked with Qwen; other presets returned "not available for Qwen Audio". A second character (the host) uses Mark.
  - **`instruction` is at most 128 characters** (longer → 422). Keep the accent note short: "light Indian English accent; unhurried".
  - **Pace after the EP001 review ("delivery too fast"), used for EP002:** generate at `speech_rate` 1.0, then `build_timing.py --tempo 1.10 --max-pause 0.30` → ≈ 2.1 words/s while talking. EP001's 2.8 words/s (rate 1.1–1.15, tempo 1.15, pauses 0.22 s) felt rushed; fully natural (tempo 1.0, pauses 0.45 s) was 1.9 words/s and 67 s long.
  - **Submit 2 at a time.** More returns 429 (no charge); wait, then send the next pair.
  - **Transcribe every line** (faster-whisper `small.en`, with 0.5 s of padding) before the edit. TTS drops the words before a colon: "Stop one: Lay, Ladakh!" and "Stop two: Chang-thang…" both lost "Stop N". Write "Stop two... " instead.
  - **Respellings that passed:** See-too, Lay (Leh), goor-goor cha, kham-beer, kho-lak, chur-peh (churpe), tsahm-pa (heard as "sampa", acceptable), Chaang-thaang (Changthang; "Chang-thang" came out "Chung Tong"), "tuk-pa..." (thukpa; "took-pa, warm" blurred into "took power warm"), Noo-bra, pash-meena.
  - ~0.02 credits per line, ~0.44 per episode.
  - Later: `create_voice` from a consenting speaker's 30–60 s in-character recording, then the same calls with `voice_type: element`.
- **Never** clone or imitate a real person or celebrity without written consent. Never use a caricature accent.
- **Pronunciation:** respell local names in the TTS text. Re-render only the broken phrase and splice it in. The reviewer signs off.
- **Timing:** `what-india-eats/pilot/scripts/build_timing.py --vo VO_DIR --host host.wav --tempo 1.15 --max-pause 0.22 --sprites` trims each line, shortens long pauses inside it, speeds it 1.15× (sox, pitch kept), places the lines in order and writes the script→real time map, captions and lip-flap track. Shots never get squeezed more than 1.4×, a line never runs over a cut, and story beats (meal whistles, the host's reply, the closing sting) stay after their lines.
- **Length:** at the EP002 pace (≈ 2.1 words/s while talking, plus whistles, gags and the loop), **90 words ≈ 50 s and 110 words ≈ 60 s**. EP002 (109 words) is 60 s.
