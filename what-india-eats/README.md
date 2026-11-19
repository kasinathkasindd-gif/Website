# What India Eats: Phase 8 approval pack

**Status (19 Nov 2026):** plan approved; **EP001 Leh is built as a voiced 3D cut** for 9.07 Higgsfield credits (balance 191.08). At the Lean tier (≈ 0.55 credits per episode) the remaining credits cover ≈ 347 episodes: Ladakh → Mizoram, 17 states/UTs. Details: [`06-production/3d-and-voice-budget.md`](06-production/3d-and-voice-budget.md) §0 and §6.

## Production status (after your approval)

| Step | Status |
|---|---|
| Approval pack | ✅ Approved |
| Hero design | ✅ **Vector Seetu approved**, 0 credits ([sheet](library/seetu/seetu-sheet.png)) |
| Pilot EP001 Leh | ✅ **Silent animatic built**, 0 credits: [`pilot/renders/ep001-leh-animatic.mp4`](pilot/renders/ep001-leh-animatic.mp4) · [key frames](pilot/renders/ep001-contact-sheet.png) · [how to rebuild](pilot/README.md) |
| Voice | ✅ Qwen TTS **Leo** for Seetu (one emotion per line), Mark for the host. 0.02 credits per line |
| Ladakh season research (all 8 districts) | ✅ Done: [`01-research/ladakh-food-table.md`](01-research/ladakh-food-table.md) (1 dish row Verified, 23 Partially verified; local reviewer needed, especially for Drass and Sankoo) |
| 3D Seetu | ✅ Polished 3D-look render (variant 1 of 4), faceless lid/body layers for the video, and a 3D model (GLB). 5.5 credits. Ids: [`library/seetu/3d/README.md`](library/seetu/3d/README.md) |
| **EP001 voiced 3D cut** | ✅ 58 s, 1080×1920, −14 LUFS: 3D Seetu with drawn face and lip-flap, 21 voiced lines + host, 6 real SFX, captions synced to the voice. In your **Higgsfield library** as `ep001-leh-voiced-3d-v2.mp4`. Build: [`pilot/README.md`](pilot/README.md) |
| EP001 review | Voice too fast; animation froze (11 still stretches, ≈ 17 s of 58 s). Fixed in the engine and applied to EP002 (EP001 not regenerated, as asked) |
| **EP002 Changthang** | ✅ 60 s, slower voice (2.1 words/s), no-freeze motion, yak/herd SFX. Script: [`04-scripts/ep002-changthang-ladakh.md`](04-scripts/ep002-changthang-ladakh.md). In your **Higgsfield library** as `ep002-changthang.mp4` |
| Skill | 📝 v0.4 draft with the review fixes, **waiting for your approval** to save: [`../.claude/skills/youtube-shorts/SKILL.md`](../.claude/skills/youtube-shorts/SKILL.md) |

## What's in here

| # | Deliverable you asked for | File |
|---|---|---|
| 1 | Research method | [`01-research/research-method.md`](01-research/research-method.md) |
| 1 | States/UTs in a fixed order + verified district counts (791 districts → 793 episodes) | [`01-research/states-and-districts.md`](01-research/states-and-districts.md) · [`districts-master.csv`](01-research/districts-master.csv) |
| 1 | **Full sample state: Kerala**, 14 districts × 3 meals, with status per row | [`01-research/kerala-food-table.md`](01-research/kerala-food-table.md) (readable) · [`kerala-food-table.csv`](01-research/kerala-food-table.csv) (the one table) |
| 1 | Rows for the two non-Kerala script districts (Leh, Kohima) | [`01-research/script-districts-food-table.md`](01-research/script-districts-food-table.md) |
| 1 | Every source, with tier and URL | [`01-research/sources.md`](01-research/sources.md) |
| 2 | Full character sketch: **Seetu, the pressure cooker** | [`02-character/character-bible.md`](02-character/character-bible.md) |
| 3 | Global presentation strategy (Phase 2) | [`03-strategy/global-presentation.md`](03-strategy/global-presentation.md) |
| 3 | Series plan, format, titles, thumbnails, hashtags, timing, playlists, comment prompts, cross-posting | [`03-strategy/series-and-virality-plan.md`](03-strategy/series-and-virality-plan.md) |
| 3 | Monetization plan (incl. the **1 Feb 2027 YPP change**) | [`03-strategy/monetization.md`](03-strategy/monetization.md) |
| 3 | 3 sample scripts: **Ice · Fire · Water** | [`ep001 Leh`](04-scripts/ep001-leh-ladakh.md) · [`ep362 Kohima`](04-scripts/ep362-kohima-nagaland.md) · [`ep579 Alappuzha`](04-scripts/ep579-alappuzha-kerala.md) |
| 3 | Sound plan + playable sonic-logo prototypes (made with code, 0 credits) | [`05-sound/sound-guide.md`](05-sound/sound-guide.md) · `three-whistle-sting-prototype.wav` · `rocket-mode-prototype.wav` |
| 3 | Credit estimate and low-credit production plan | [`06-production/low-credit-plan.md`](06-production/low-credit-plan.md) |
| 4 | **Draft skill** | [`../.claude/skills/youtube-shorts/SKILL.md`](../.claude/skills/youtube-shorts/SKILL.md) + `references/` + `scripts/` |

## Headline numbers

- **District count:** 28 states + 8 UTs = **791 administrative districts** as of 18 Nov 2026, plus 2 culturally distinct census districts = **793 episodes**.
  - Changes verified since 2025: Andhra Pradesh 28, Gujarat 34, Haryana 23, Goa 3, Delhi 13, Ladakh 8.
  - A Census boundary freeze holds the counts until 31 Mar 2027.
- **Kerala sample:** 42 rows. **3 Verified, 39 Partially verified, 0 invented.**
  - Written sources describe Kerala food by region, not district by district, so most rows inherit a labelled regional pattern.
  - All 14 unique facts have sources: 10 are Verified (2 of those with a sub-claim only partly verified) and 4 are Partially verified.
- **Cost per episode:** about **3.9 (Lean) / 8.4 (Standard) / 17.4 (Premium)** credits. That is **≈39 / 84 / 174 per 10 episodes**, plus a one-time setup of about 61 credits (≈104 if music and SFX are generated).
  - Full AI video would be about 890 credits per 10 episodes.
- **Money reality check:** from 1 Feb 2027, new channels need 1,000 subscribers plus **20 M Shorts views in 90 days or 8,000 watch hours** to monetise.
  - So each state ends with a long-form compilation to build watch hours.
  - Brand deals (spices, cookware, travel) are the main revenue line.

## Decisions I need from you

1. **Character:** approve **Seetu** (name, look, catchphrase "Three whistles — done!"), or pick a backup name (Kooker / Teeno), or ask for a different concept.
2. **State order:** the clockwise journey starting in Ladakh (recommended), or alphabetical.
3. **Voice:** your own recorded voice or a hired actor (recommended, 0 credits), or an AI clone from a consenting speaker (~0.2 credits per episode).
4. **Music:** compose a small original library (0 credits), or generate it once on Higgsfield (~40 credits).
5. **Budget tier for the first 20 episodes:** Standard (recommended) or Lean.
6. **Research access:** this sandbox could not open lgdirectory.gov.in, igod.gov.in or en.wikipedia.org. For the full run, allowing these three hosts in the environment's network settings lets me pull the official district lists directly. Otherwise I'll continue through web search.
7. **Local reviewers:** do you have (or want me to plan for) one reviewer per state to confirm dishes, native-script names and pronunciations?

Once you approve or send corrections, the next steps are:
1. Generate 4 hero designs of Seetu (~4 credits; I'll quote first).
2. Build the pose library.
3. Produce the Leh pilot.
