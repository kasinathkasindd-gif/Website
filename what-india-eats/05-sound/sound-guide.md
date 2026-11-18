# Phase 5: Sound guide

**Rule zero: original or properly licensed audio only. No copyrighted songs, ever.** There are two reasons:
1. A Content ID claim can take a Short's revenue or block it.
2. Shorts that use licensed music split their revenue with music partners. Original audio keeps the whole Short's share in the creator pool (P03).

## 1. Sonic logo: "The Three-Whistle Sting" (1.6 s, original)

| t (s) | Layer | Sound |
|---|---|---|
| 0.00–0.40 | Pressure build | Rising steam hiss (band-passed noise, 2→6 kHz sweep) plus a lid-rattle tremolo |
| 0.45 | Whistle 1 | Short tonal whistle on **G5** (784 Hz), 0.18 s |
| 0.75 | Whistle 2 | Short whistle on **B5** (988 Hz), 0.18 s |
| 1.05–1.45 | Whistle 3 | Long whistle on **D6** (1,175 Hz) with vibrato (5.5 Hz, ±20 cents) and a breathy noise layer |
| 1.50 | Button | "Ting!" A steel spoon on a steel tumbler (decaying sine pair on G6 and D7) |

- **The motif:** the three whistles rise through a major triad (G–B–D). That makes it bright and happy, and singable ("whee-whee-wheeee").
- **How to make it (0 credits):**
  - **Best:** record a real cooker whistle three times on a phone, then pitch-correct it to G5/B5/D6. It's authentic and you own it.
  - **Or:** synthesise it in code (sine + filtered noise + vibrato). `.claude/skills/youtube-shorts/references/sound-guide.md` has the recipe.
- **Prototypes in this folder:** `three-whistle-sting-prototype.wav` (2.2 s) and `rocket-mode-prototype.wav` (3.6 s), synthesised with `.claude/skills/youtube-shorts/scripts/sting.py` (measured pitches: 784 / 988 / ~1,175 Hz). They are placeholders for judging the motif; the final logo should be a recorded real cooker whistle.
- **Uses:**
  - Full sting at the end of every episode ("Three whistles — done!").
  - A single whistle as the 0.0 s hook pattern-interrupt.
  - 1, 2 and 3 whistles as the meal-segment counters.
  - Rocket Mode: whistle 3 holds for 2 s, rising a fifth, and fades into a whoosh.
- **Consistency:** never change the pitches. The motif *is* the brand.

## 2. Background music per segment (instrumental, about −20 to −24 LUFS under the voice)

| Segment | Mood | Tempo | Palette | Notes |
|---|---|---|---|---|
| Hook / arrival | Bright, sudden | — | Mostly SFX; a 1-bar pickup | Leave space for the whistle |
| **Breakfast** | Fresh morning, light | 90–96 BPM | Plucked strings (mandolin/veena-*like*), soft shaker, bird ambience | Major key |
| **Lunch** | Busy midday, rhythmic | 104–112 BPM | Hand-drum groove (dholak/tabla-*like* patterns), bass pluck, clap | Mixolydian or major |
| **Dinner** | Warm, calm, cosy | 76–84 BPM | Breathy flute pad (bansuri-*like*), soft drone, light bells | Slower; the voice warms down |
| **Unique fact** | "Wait, what?" | Music ducks −8 dB | Riser + sub "whomp" + "ding" | The lid-pop lands on the ding |
| **Cliffhanger** | Momentum | 120 BPM | "Train-chug" percussion build → cut on the sting | Ends on the whistle |

**Regional colour (light touch, respectful):**
- Each season can add *one* regional timbre to the beds, for example:
  - bamboo percussion (Northeast)
  - a harmonium-like pad (North)
  - a mridangam-like pattern (South)
- **Don't** use religious chants, temple or prayer music, or sacred instruments as gags.
- **Don't** reach for the "sitar = India" cliché every episode.

**Where the music comes from (in order of preference):**
1. **Your own small original library:** 3 beds (breakfast/lunch/dinner) × 3 variants + the sting + the cliffhanger build, composed once in a DAW or generated once. Use it everywhere: YouTube, Instagram, Facebook. No claims, no splits.
2. **Higgsfield ElevenLabs Music v2.5** at ≈ **4.36 credits per 30 s** (quoted 18 Nov 2026). Generate the 9 beds once, about 40 credits. Before using them commercially, check the music licence terms that come with your Higgsfield plan.
3. **YouTube Audio Library:**
   - "Standard licence" tracks are for YouTube videos only. Creative Commons tracks need attribution (P13).
   - **That means they are not OK for the Instagram/Facebook cross-posts**, so use them only for YouTube-exclusive pieces.
4. **Pixabay Music:**
   - Usable, but some uploaders register tracks with Content ID. Claims can happen; keep the licence certificate for disputes (P22).
   - Use it as a last resort.

**Never:** trending songs, "no copyright" YouTube uploads, or remixes of film songs.

## 3. Sound effects library (build once, reuse forever)

| Category | Sounds | Best source |
|---|---|---|
| **Signature** | Cooker whistle (single, double, triple, rocket), steam hiss, lid rattle, lid pop | Record a real cooker, or synthesise |
| **Prep** | Chopping on wood, coconut scraping, stone grinding (mortar/ammikkallu), rolling pin, kneading squish | Record in a home kitchen (best and authentic), or Freesound **CC0 only** |
| **Cooking** | **Mustard seeds popping in hot oil** (tadka, the series' "sizzle"), deep sizzle, boiling bubbles, pressure-cooker rocking | Record |
| **Pouring & serving** | Water pour, tea pour from a height, ladle clink on steel, steel plate "ting", banana-leaf rustle | Record or CC0 |
| **Places** | Wind (Ladakh), backwater birds and paddles (Kerala), fire crackle (Naga hearth), market murmur, bus/jeep/train/boat | CC0 or Higgsfield Mirelo SFX (≈ **0.5 credits per 2 s**) for the hard ones |
| **UI / motion** | Whoosh, pop (text in), stamp thud, ding (fact), counter tick | Synthesise in code (0 credits) |

**Levels** (per the cut-out pipeline):
- Voice 0 dB reference
- Hits and splashes −5 to −13 dB
- Whooshes −19 to −25 dB
- Ambience beds −27 dB, ducked under the voice

**Delivery target:**
- About **−14 LUFS integrated**, true peak ≤ −1 dBTP. YouTube normalises loudness, so don't over-compress.
- Instagram and Facebook use the same master.

## 4. Voice style and AI voice setup

**Style:** see the character bible §6.
- Warm, playful, curious; light natural Indian English.
- 2.6–2.9 words/s, rising questions, smiles in the voice.

**Option A (recommended):** a real human voice.
- You, or a hired voice actor, record Seetu's lines.
- Light processing:
  - +1 to +2 semitones of pitch
  - high-pass at 90 Hz
  - +2 dB presence at 4 kHz
  - gentle compressor (3:1)
  - de-esser
- **0 credits.** It's the most authentic option and the strongest answer to YouTube's "inauthentic content" concerns.

**Option B (AI, consistent and cheap):**
1. Record 30–60 s of the *consenting* voice actor (or yourself) in character. Create a custom voice with Higgsfield **Create Voice**, which gives a reference voice element.
2. Generate each episode's narration with **Qwen Audio 3.0 TTS** using that voice.
   - About **0.21 credits per 45-s script** (quoted 18 Nov 2026).
   - Style instruction (≤128 chars): `warm, playful, curious; light Indian English accent; medium-fast; smiling; slow down on food names`.
3. **Fallback:** ElevenLabs through Higgsfield *Text-to-Speech v2*, about **1.5 credits per script**. Audition preset voices by their preview URLs; accents aren't labelled, so listen first.
4. **Never** clone or imitate a real person's voice without their written consent, and never imitate a celebrity.

**Pronunciation workflow:**
- Each script carries a respelling list (e.g. *Alappuzha* → "AH-lup-poo-zha").
- If the TTS mangles a name, re-render only that phrase and splice it in.
- The local reviewer signs off on the names.

**Timing:**
- Measure the real voice timing from the audio: use the silence-detection script in the skill (`pauses.py`), or word timestamps.
- All animation and SFX hang off those times, so a new voice take only needs re-measuring.
