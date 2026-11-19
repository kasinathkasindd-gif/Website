# Seetu 3D: asset record (Higgsfield, 19 Nov 2026)

These files live in your Higgsfield library. This cloud session can't download from Higgsfield's CDN, so only the ids are kept here; open them from Higgsfield (Assets / History) or reuse them by id in a generation call.

## Character

| Asset | Job / media id | Model | Credits |
|---|---|---|---|
| Polished 3D-look Seetu, **variant 1 (chosen)**: front view, relaxed arms | `2579608c-150c-4ca5-bf7e-b495ef550792` | GPT Image 2.6, medium, 2k, transparent | 1.0 |
| Variant 2 (waving) | `a5e30abc-682a-4a07-bf68-02ced2a82cf9` | same | 1.0 |
| Variant 3 (waving) | `d89c54aa-391a-453f-9c84-d452f0132d9e` | same | 1.0 |
| Variant 4 (waving, taller pot) | `568748f0-7892-45db-b046-bc64dd50ba62` | same | 1.0 |
| **Faceless, limbless pot** (input to 3D, and the source of the lid/body layers) | `23df2acc-f4f1-4db6-bd48-682a5833be7e` | GPT Image 2.6, medium, 1k, transparent | 0.5 |
| **3D model (GLB)**: pot, domed lid, red whistle, long handle, scarf with knot | `091e4104-7a97-495a-b5f3-290548bcd5e9` | SAM 3 3D Objects | 1.0 |

- The variant 1 reference was made from the approved vector hero (`../seetu-hero.png`, imported as media `be9ecff9-89ff-42ad-880a-02a3f20a36a6`).
- **Layers in the video:** `pilot/scripts/cut_sprites.py` cuts the faceless render at the gasket line (lid + handle / body + scarf). Face, arms and legs stay vector in `pilot/src/Seetu.tsx`, so expressions and lip-flap cost 0 credits.
- **GLB orientation:** Y up; the side that matches the front view faces yaw 90°. It is textured, about 7.7k vertices. A three.js turntable check rendered cleanly (lid, handle and scarf all in the round).

## Voice

| Role | Voice | Id (Higgsfield preset) |
|---|---|---|
| Seetu | **Leo** (Qwen TTS), young male, median pitch ≈ 220 Hz | `73a45c18-0c56-4642-a61e-f6b303f8ded1` |
| Host ("Every day!") | Mark (Qwen TTS), ≈ 130 Hz | `27c04473-84a9-4b60-a41f-c8e8458bd4f1` |

- Only Leo and Mark accepted Qwen; other presets returned "not available for Qwen Audio".
- **Settings:** `qwen_audio_tts`, `voice_type: preset`, `language: en`, `format: wav`, `sample_rate: 48000`, `speech_rate` 1.05–1.15, plus one emotion instruction per line ending in "light natural Indian English accent". About 0.02 credits per line.
- **Respellings that worked** (checked with speech-to-text): Seetu → "See-too", Leh → "Lay", gur-gur cha → "goor-goor cha", khambir → "kham-beer", kholak → "kho-lak", thukpa → "took-pa", Changthang → "Chang-tang", dal → "daal".
- **Gotcha:** "Stop one: Lay, Ladakh!" dropped "Stop one". "Stop one... Lay, Ladakh!" fixed it. Always transcribe every line before the edit.

EP001 line jobs (index = caption cue):

| # | Job id | # | Job id |
|---|---|---|---|
| 00 | `e302b2f2-ce80-4426-841f-72cad7bcd056` | 11 | `a305dda0-be8e-446c-9a05-c38836692e82` |
| 01 | `2a1533b1-3b0d-42ce-bc12-84780d36271d` | 12 | `cd872d88-8179-4e8d-a952-3af2247eba71` |
| 02 | `4cb1a401-1a82-4305-a5c9-ea743864d309` | 13 | `f17bb8d1-8619-4a8f-a8aa-8bb49849cb47` |
| 03 | `fe237a52-e38b-41b3-8b27-c16f2290ab14` (retake) | 14 | `f31c2b93-3554-427e-a742-54db402cc3e2` |
| 04 | `c4700513-1167-49e4-aeda-493a1997324f` | 15 | `096cc1ad-8300-4513-9f9e-7a9d6641498d` |
| 05 | `9ea8d22b-db67-4670-b9ee-e62d5c071941` | 16 | `f1003961-345e-4ec7-bf99-0b992d9ec023` |
| 06 | `14c6ad45-4615-4d74-9468-72e7da2ec5ad` | 17 | `2410ec5e-450d-4b82-b4fc-4a3f90475a49` |
| 07 | `cfcc0514-207f-4b69-b7e9-7ed63683b135` | 18 | `f08375bd-27f1-422d-b4d0-fe501fffd38a` |
| 08 | `5ade0961-b289-42bf-aa3d-6dc20ccb945a` | 19 | `553022d9-2a79-418e-b485-f67b5691c20a` |
| 09 | `cacdae43-9a2e-4855-b395-39168cc66c74` | 20 | `32dc6551-e640-44ff-999e-402068f0a68c` |
| 10 | `68d31b93-3448-47d7-b41e-33a36c3acd04` | host | `d28a5625-b0b7-4b88-ba92-160ade690bbb` |

## Sound effects (Mirelo, 2 s, 0.5 credits each; reusable library)

| Sound | Replaces | Job id |
|---|---|---|
| Cold mountain wind | `wind.wav` | `4e4658fd-4198-47b9-9762-4c19887526b0` |
| Steel ladle on a plate | `clink.wav` | `63cd546d-7782-4e31-85cc-f86b173c628d` |
| Butter-tea churn | `churn.wav` | `5df61da4-bd7f-41c7-80f6-dae92d3d64fd` |
| Tea pour | `pour.wav` | `40b7ece9-488c-4806-bf04-be4f339f27f6` |
| Jeep arriving on gravel | `jeep.wav` | `70a912fa-2b06-4e32-bd2f-430ce937584a` |
| Wood stove crackle | `fire.wav` | `f518f081-ae9c-4455-b130-8f8b93c1aadf` |

## Output

| File | Higgsfield media id |
|---|---|
| **`ep001-leh-voiced-3d-v2.mp4`** (final: last line lands on the Changthang reveal) | `4b4ac753-cfb7-4c05-bf86-da1a4a8867f7` |
| `ep001-leh-voiced-3d.mp4` (first cut) | `b5aa575e-9cda-4b3e-bc43-aeb6ab564426` |
| `ep001-leh-contact-sheet.jpg` | `ac1c559d-d2e9-4119-98b0-f63e6036a664` |

## EP002 Changthang (Qwen TTS, Leo, `speech_rate` 1.0)

| # | Job id | # | Job id |
|---|---|---|---|
| 00 | `5e316734-f771-4827-8d2e-fe5519af2178` | 07 | `61cd996d-6960-4177-9798-9415e826bdff` |
| 01 | `1b8ed551-5dc2-45ac-a042-dbe7dc88ce96` | 08 | `dd190801-d81d-4235-a6a8-10521e4e04e4` (retake: "tuk-pa...") |
| 02 | `1e39ad63-c032-4892-b8d3-754bacb35db2` (retake: "Stop two... Chaang-thaang") | 09 | `1f6a46ac-1aa6-43df-b84e-642953db6985` |
| 03 | `2aa213b7-a3d5-4eaa-8a34-82ed50713059` | 10 | `e59e3304-7fbe-496e-a20e-5aa4e33ae8cc` |
| 04 | `cd63757c-8a32-421d-aea2-97458922bea1` | 11 | `a9773e7f-8743-4e74-8f0a-130e7e6c94b0` |
| 05 | `c2f32df3-ad65-4d08-b1f5-28f6466fc2c8` | 12 | `50348006-b8bc-478b-8be1-5dd1de49f8b5` |
| 06 | `2c5dd711-320c-4735-a40a-be2c3ccf8eab` | 13 | `30d04901-cc4d-4b58-b254-a427ce32c3c1` |

New reusable SFX (Mirelo, 0.5 each): yak grunt `5c01bbf6-1a0e-4169-806e-5e9e87406a8b` → `yak.wav`; goats and sheep on a windy plateau `c224bd9b-fb79-454d-901e-5e9198cddc08` → `herd.wav`.

Output: `ep002-changthang.mp4` → Higgsfield media `35ff4046-2db0-4688-82a9-fbab8809c896`; contact sheet `edc3706c-be47-4dc9-9fda-1be68f0c6913`.
