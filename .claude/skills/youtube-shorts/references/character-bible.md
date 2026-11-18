# Character production bible: Seetu (operational)

Full creative bible: `what-india-eats/02-character/character-bible.md`. This file holds what generation and animation need.

**Canonical source (approved 18 Nov 2026): the vector rig.**
- Design sheet and generator: `what-india-eats/library/seetu/build_seetu.py`
- Animatable React component: `what-india-eats/pilot/src/Seetu.tsx`, with props for eyes, brows, mouth, arms, walk, lidLift/lidTilt, steam, flush, blink, look and squash.
- The AI prompt blocks below are kept only for optional painted key art. Use the rig sheet as the reference image.

## Identity in one line
Seetu: a 32-"cooker-year"-old living aluminium pressure cooker who eats breakfast, lunch and dinner with a family in every district of India and whistles once per meal. Gender unspecified. Light, natural Indian-English voice. Catchphrase: **"Three whistles — done!"**

## Prompt blocks (paste verbatim; never paraphrase)

**CHAR**
> A small, squat, round-bellied aluminium stovetop pressure cooker brought to life as a cartoon character. Silver steel body (#C8CED6, highlight #EEF1F4, shade #8F98A3) with a gently domed lid. A chilli-red (#E63B2E) pressure whistle on top of the lid, like a topknot. A long black handle sticking out to the character's RIGHT like a ponytail. A thin black gasket line between lid and body. On the front of the body: two big oval eyes (white, large black pupils, one round highlight each), thick expressive black eyebrows, a small wide mouth. Thin black rubber-hose arms and legs; turmeric-yellow (#F4B400) oven-mitt hands; chilli-red canvas sneakers with white soles. A turmeric-yellow cotton scarf with thin chilli-red stripes tied around the gasket line, two ends fluttering. No logos, no text, no brand marks.

**STYLE_HERO**
> Flat 2D cartoon, simple, cute and kid-friendly: thick smooth black outlines (#141414) of even weight, flat colours with a very soft pale shade on one side, clean vector-like linework, no texture, no gradients, no text, no border. Whole body in frame with a margin. Isolated on a fully transparent background: no floor, no shadow.

**STYLE_CHAR** (every later pose)
> Exactly the same character and the same flat 2D cartoon drawing style as the reference image: [POSE]. Keep the handle on the character's right, the red whistle on top, and the yellow striped scarf. Whole body in frame with a margin. Transparent background.

**STYLE_OBJ** (dishes, props, vehicles)
> [OBJECT, described precisely from the data table: shape, colour, vessel, garnish] in exactly the same flat 2D cartoon drawing style as the reference image: thick even black outlines, flat colours, one soft shade side, no texture, no text, no characters, no faces. Transparent background.

**STYLE_BG** (kitchens, establishing shots; 9:16)
> Flat 2D cartoon background in the same style as the reference image, 9:16 vertical, simple shapes, muted versions of the palette so characters pop, no people, no text, no logos: [SCENE described from research, e.g. "a Kerala home kitchen with clay pots, a coconut scraper, steel vessels on a shelf, a window onto palm trees"].

## Generation order and settings
1. **Hero (approval gate):** GPT Image 2.6, medium, 2k, 1:1, `background: transparent`. Make 4 variants; the user picks one.
2. **Poses:** the same model and settings with the approved hero as `image_references`. One pose per prompt.
3. **Dishes and props:** the same model and settings, with the hero as a style reference (or the series' first dish as a style anchor). Draft at low/1k (0.25) and re-render keepers at medium/2k (1.0).
4. **Backgrounds:** medium, 1k or 2k, 9:16 (0.5–1.0 credits).
5. Save every prompt, job id and cost to `prompts.md`.

## Pose list (20)
1. Hero 3/4 view
2. Wave
3. Lid-pop surprise
4. Ladle-mic forward
5. Point up-right
6. Point down
7. Sniff (eyes closed)
8. Eating
9. Delighted (blush)
10. Spicy-shocked (steam jets)
11. ROCKET (tilted, steam trail)
12. Squint ("Every day…?")
13. Arms crossed, refusing
14. Giving in
15. Writing in diary
16. Stamping map
17. Walk A
18. Walk B
19. Sitting cross-legged
20. Waving goodbye (back 3/4)

Optional: 11b, a sooty after-rocket variant.

## Animation rules (code, 0 credits)
- Place poses by **anatomy anchors** (eye-centre and body-centre), not by image box, so swaps don't jump. Measure the anchors once per pose (see the cutout-cartoon-shorts skill).
- Draw brows, blinks, mouths (lip-flap from VO loudness), steam, blush and the Steam-o-meter as SVG layers.
- Swap poses on a motion beat (squash, whoosh, lid-pop). Keep the handle on the right; mirror whole poses in code only if a shot needs Seetu to face left.
- **Silhouette test:** any new pose filled black must still read as Seetu (handle, whistle, scarf ends).

## Behaviour rules
- **Whistles count meals** (1 / 2 / 3 → "Three whistles — done!"). **Steam rates spice:** the Steam-o-meter shows 0–3 puffs, an editorial estimate from the recipe's chilli content. Seetu never rates the family's cooking.
- Rocket Mode appears in ≤ 1 in 10 episodes, only for genuinely extreme heat.
- Seetu is always a polite guest: thanks the cook, never mocks food, people or accents.
- Sponsor logos never go on Seetu.
