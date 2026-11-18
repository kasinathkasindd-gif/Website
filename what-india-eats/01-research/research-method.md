# Phase 1: Research method

The method is built to make "every district, no gaps, no made-up dishes" achievable and checkable. Research date: 18 Nov 2026.

## 1. Unit of research

- **One row = one district × one meal.** Each row records a breakfast, lunch or dinner.
- **"Average local family"** means the most common everyday home pattern across the district's main communities. It excludes restaurant food, festival food and food made only for guests.
  - Where communities eat differently (for example Mappila vs. Hindu homes in Malappuram), the row records the majority pattern and the *Notes* column records the main alternative.
  - Festival and feast food can appear only in the **Unique fact** column, and it must be labelled *festival*.
- **District list.** The base list is administrative districts, as recorded in the Local Government Directory (LGD) or in state gazette notifications.
  - Culturally distinct census districts get their own episode, flagged as such. Example: Puducherry's Mahé (Kerala culture) and Yanam (Andhra culture).

## 2. Source hierarchy (strongest first)

| Tier | Type | Examples used | Counts towards the 2-source rule? |
|---|---|---|---|
| A | Government / UN / official statistics | FAO GIAHS, GI Registry (IP India), Spices Board, ICAR/CMFRI, Census, MEA, state tourism departments, Guinness | Yes |
| B | Peer-reviewed or academic | Indian Journal of Traditional Knowledge, *Food Security* (Springer), Kerala State Biodiversity Board, MSSRF case studies | Yes |
| C | Regional press and food writers | Onmanorama (Malayala Manorama), Kerala Kaumudi, The News Minute, The South First, Down To Earth, Sahapedia | Yes |
| D | Cookbooks and recipe authors | Kerala Tourism recipe pages, established recipe authors | Yes, for **method and ingredients only** |
| E | Tertiary or commercial | Wikipedia, travel-operator pages, hotel blogs | **No.** Used only as a pointer to a stronger source |

**Independence rule.** Two pages from the same publisher count as **one** source (for example two Kerala Tourism pages, or two Onmanorama pages). Aggregator, AI-written or SEO pages never count.

## 3. Verification status (one per row, plus a separate one for the unique fact)

| Status | Rule |
|---|---|
| **Verified** | At least 2 independent sources (tier A–C) confirm the dish as everyday home food for **this district, or a named sub-region that contains it** (for example Kuttanad or Mappila Malabar). Ingredients and method agree across sources. |
| **Partially verified** | At least 2 independent sources confirm the dish as everyday food at **state or sub-regional level**, but no source names this district, so the district inherits the regional pattern. Also used when only **1** source ties the dish to this district. |
| **Unverified** | One source, or an inference. **It must not be stated as fact on screen.** It can only appear as a question ("Do families here…?") or be removed. |

The **Data basis** column always says where a row's claim comes from:
- *District-specific*
- *Sub-regional pattern (name)*
- *State pattern (no district-specific data found)*

This is the "clearly labelled closest regional pattern" you asked for.

## 4. Step-by-step workflow per state

1. **Lock the district list.**
   - Pull the official LGD export.
   - Cross-check every creation, merger or rename since the last export against gazette notifications or press reports of them.
   - Record count, date and evidence (see `states-and-districts.md`).
2. **Map the regions.** Group districts into culinary sub-regions (for example South Kerala, Central Travancore, Kuttanad, Malabar, Palakkad Gap, High Range) so gaps can be filled with *labelled* regional patterns.
3. **Establish the state baseline.** Find at least 2 independent sources for the state's everyday breakfast, lunch and dinner. In Kerala these were puttu, appam, idiyappam, rice meals and kanji.
4. **Run district searches.** For each district, search the following, in this order:
   - official district / tourism pages
   - GI registry, FAO, ICAR and similar bodies (for unique facts)
   - academic papers
   - regional-language press
   - food writers
5. **Fill each row.** Record:
   - local name in the native script plus romanisation
   - English meaning
   - ingredients
   - method (key steps, vessel, time)
   - unique fact
   - sources, status, data basis, notes
6. **Run the cross-check pass.** A second pass looks only for **contradictions**, such as conflicting dates, percentages or dish counts. Conflicts are written into the row ("sources vary: 64 vs 70+ dishes") and are never silently resolved.
7. **Do a local check before production (human).** One local reviewer per state, either a food writer or a home cook from that district, reads the rows. Any correction they make needs a source or is labelled *local testimony*. This is the only way to get from *Partially verified* to *Verified* in districts with thin written records.
8. **Freeze the data.** A script can only use Verified facts, plus Partially verified facts phrased as regional ("Across central Kerala…").

## 5. Sensitivity rules (built into the checklist)

- **Religion, caste and community:**
  - Don't present one community's food as the whole district's.
  - Name communities only when the source does, and respectfully.
  - Beef, pork and vegetarian food are shown factually, with no value words.
- **Language:** Never use "weird", "disgusting", "exotic" or "poor man's food" (unless quoting a historical source, with context).
- **Price claims:** Every price needs a dated source. Show local currency first, then an approximate US$ figure with the exchange-rate date.

## 6. Limits of this checkpoint (stated plainly)

- **Network limits.** This cloud sandbox **could not open** lgdirectory.gov.in, igod.gov.in or en.wikipedia.org (blocked by the environment's network policy).
  - District counts were therefore checked against government notifications and press reports of them, all found through web search. They have **not** yet been reconciled against the LGD export itself.
  - The full district *name* list for the 33 other states/UTs will be pulled from LGD at the start of the full run. I didn't want to type about 790 names from memory.
- **How sources were read.** Pages were read through the search tool's page extraction, not opened directly. Every source URL is listed in `sources.md` so anyone can re-open it.
- **Local review still needed.** Most Kerala rows are **Partially verified**. That is the honest result: written sources describe Kerala food by region (Malabar, Travancore, Kuttanad), not district by district. Step 7 (local check) is what will lift these rows.
