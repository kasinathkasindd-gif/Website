# Episode template (copy for every new episode)

```markdown
# EP NNN · <District>, <State>

| | |
|---|---|
| Route position | District **NNN / TOTAL** · Season SS (<State>, N districts) · previous: <A> · next: <B> |
| Contrast role | one word + why (vs the neighbour) |
| Length | 50–60 s · 9:16 · 1080×1920 |
| VO | 90–110 words at the EP002 pace (≈ 2.1 words/s while talking; 90 words ≈ 50 s, 110 ≈ 60 s) |
| Data rows | <STATE>-<DST>-B, -L, -D, -FACT |

## Fact check
| # | Claim exactly as written | Row | Status | Sources |
(Verified = stated flatly · Partially verified = phrased regionally/"many homes" · Unverified = not allowed)

## Shot list and timing
| Time | Shot | Visual | Seetu pose # | On-screen text | VO | Audio |
| 0.0–2.0 | 1 HOOK | most surprising VERIFIED fact, hard cut, lid-pop | 3 | ≤6 words | ≤8 words | WHEET! |
| 2.0–4.5 | 2 Arrival | local transport over the establishing shot | walk | 📍 District, State | "What's cooking, <District>?" | vehicle SFX |
| 4.5–14 | Breakfast (2–3 shots) | ingredients → vessel → plate | | ☀️ + dish card (script · roman · English) | | breakfast bed, 1 whistle |
| 14–24 | Lunch | | | 🍚 + dish card | | lunch bed, 2 whistles |
| 24–34 | Dinner | | | 🌙 + dish card | | dinner bed, 3 whistles |
| 34–41 | FACT | lid-pop + diagram/map/object | 3 | fact card ≤12 words + source tag | | duck, riser, ding |
| 41–45 | Cliffhanger | stamp, counter, teaser silhouette | 16 | Next: <B> | "Three whistles — done! Just one more… <B>!" | sting |
| last 1 s | Loop | match frame 1 | | | | |

## Clean VO
(one paragraph, exactly what is recorded or sent to TTS)

**Pronunciation:** name → respelling (reviewer-checked)

## Assets
| Asset | New/reuse | Credits (quoted on <date>) |

## Upload pack
Title options (2–3) · description first lines + sources + data link · 3–5 hashtags · pinned question · playlist · related video · disclosure
```

## Variety rule (protects against YouTube's "inauthentic content" policy)
Compared with the previous episode, change **at least 3** of these:
1. hook type (number · question · myth-bust · sound)
2. arrival vehicle
3. which running gag carries the episode
4. camera framing or layout of the meals
5. which meal hosts the "Every day… or just for guests?" beat
6. fact visual type (diagram · map · object · comparison)

Rotate the title formulas too. Never re-use a sentence of narration from an earlier episode except the catchphrases.

## Motion rules (no frozen frames; from the EP001 review)
EP001's first cut froze for ≈ 17 s of 58 s: the voice ran longer than the animation keys, so shots finished and held. Every episode now follows these rules, and `pilot/scripts/qa_motion.py` must report **no still stretch over 0.5 s and no glitch frame** before upload.
1. **Time shots to the voice you expect** (≈ 2.1 words/s plus beats), so the voice map barely stretches them.
2. **Something always moves:** wrap every scene in `<Cam>` (slow push/pan), keep Seetu's `idle` on (breathing; bounce and nod while talking), and give each background ambient motion (clouds, flags, herds, snow, steam, stars, fire).
3. **One new visual beat per voice line** (a prop arrives, a card pops, a pose or gag changes). A line longer than 4 s gets a second beat in the middle.
4. Story beats that depend on the voice (whistles, a host's reply, the sting) are `events` in the episode's `timing.json`, so they always land after the right line.

## Writing rules
- One fact per beat. Short sentences. Questions are welcome.
- Use respectful comparison bridges ("≈ congee") only when a source or the dish itself supports the comparison. End bridges with a viewer question.
- Festival or guest food appears only inside the guests gag or the fact, labelled.
- Never name a real family member without consent. The default host is generic ("Amma", "Chechi" only if appropriate to the region and agreed with the reviewer).
