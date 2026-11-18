# Data schema

## Food table (one CSV per state): `research/<state>-food-table.csv`

Columns, in order:

| Column | Rule |
|---|---|
| State | Official name |
| District | Official name (LGD); census-only districts flagged in Notes |
| Meal | Breakfast / Lunch / Dinner |
| Dish (local name) | Native script (from a source or reviewer, never guessed) + romanisation; `+` joins the components of a plate |
| English name | A plain description, not a "version of X" |
| Ingredients | Main ingredients, per component |
| Cooking method (key steps, vessel, time) | Short; vessel named; approximate minutes |
| Unique fact [sources] | One per district (repeated on its 3 rows); festival items labelled *festival* |
| Source | Source IDs for the dish (≥2 different publishers for Verified) |
| Verification (dish row) | Verified / Partially verified / Unverified |
| Verification (unique fact) | Same scale, plus a short reason if partial |
| Data basis | `District-specific` · `Sub-regional: <name>` · `State pattern (no district-specific data found)` |
| Notes / alternatives | Community splits, conflicts between sources, things to confirm locally |
| Spice estimate in steam puffs (editorial, not research) | 0–3, or "Rocket"; from the recipe's chilli content (shown on the Steam-o-meter) |

**Row IDs** used in scripts: `<STATE2>-<DST3>-<B|L|D|FACT>`, e.g. `KL-ALP-L`, `LA-LEH-FACT`, `NL-KOH-D`.

## District master: `research/districts-master.csv`
`route_order, state_or_ut, type, districts_as_of_<date>, count_status, evidence_and_notes, sources`

## Sources: `research/sources.md`
| ID | Tier (A–E) | Source (publisher, date, title) | URL |

- Same publisher = one source for the 2-source rule.
- Tier E (Wikipedia, travel operators, SEO pages) is a pointer only.

## Episode log: `log.md`
| Ep | District | Publish date (UTC) | Tier | Credits spent | Views 48 h | Avg % viewed | Swiped away % | Top 3 countries | Corrections received | Status |
