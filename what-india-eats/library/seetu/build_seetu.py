"""Seetu vector rig (0 credits). Generates SVG poses/expressions from one parametric drawing.
Usage: python3 build_seetu.py <outdir>
Palette and anatomy follow what-india-eats/02-character/character-bible.md.
"""
import sys, os

INK, STEEL, HI, SHADE = "#141414", "#C8CED6", "#EEF1F4", "#8F98A3"
RED, TURMERIC, WHITE, BLUSH = "#E63B2E", "#F4B400", "#FFFFFF", "#F7A1A1"
MOUTH, TONGUE = "#7A1E16", "#F28C8C"
SW = 12  # main outline width

BODY = "M 290 440 C 262 500, 248 560, 252 615 C 256 690, 280 750, 330 770 L 670 770 C 720 750, 744 690, 748 615 C 752 560, 738 500, 710 440 Z"

def mitt(cx, cy, rot, fill=TURMERIC):
    return (f'<g transform="translate({cx} {cy}) rotate({rot})">'
            f'<ellipse cx="0" cy="0" rx="30" ry="36" fill="{fill}" stroke="{INK}" stroke-width="9"/>'
            f'<ellipse cx="-26" cy="6" rx="12" ry="18" transform="rotate(-25 -26 6)" fill="{fill}" stroke="{INK}" stroke-width="9"/>'
            f'<rect x="-22" y="26" width="44" height="16" rx="7" fill="{fill}" stroke="{INK}" stroke-width="8"/>'
            f'<path d="M -18 -8 Q 0 -14 18 -8" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.35"/>'
            '</g>')

def shoe(x, flip=False):
    s = -1 if flip else 1
    return (f'<g transform="translate({x} 0) scale({s} 1)">'
            f'<path d="M -38 892 Q -40 856 -2 856 Q 32 856 40 880 L 42 892 Z" fill="{RED}" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
            f'<rect x="-46" y="886" width="94" height="16" rx="8" fill="{WHITE}" stroke="{INK}" stroke-width="9"/>'
            f'<path d="M -12 866 L 6 878 M -2 862 L 16 874" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/>'
            '</g>')

def steam(paths):
    return "".join(f'<path d="{d}" fill="{WHITE}" fill-opacity="0.92" stroke="{SHADE}" stroke-width="6"/>' for d in paths)

def eyes(kind):
    out = []
    for cx, side in ((430, -1), (570, 1)):
        if kind in ("open", "wide", "spicy"):
            rx, ry = (52, 64) if kind == "open" else (58, 72)
            out.append(f'<ellipse cx="{cx}" cy="590" rx="{rx}" ry="{ry}" fill="{WHITE}" stroke="{INK}" stroke-width="10"/>')
            pr = 30 if kind == "open" else 18
            px = cx - side * 7 if kind == "open" else cx
            out.append(f'<circle cx="{px}" cy="598" r="{pr}" fill="{INK}"/>')
            out.append(f'<circle cx="{px + 10}" cy="{598 - pr * 0.45:.0f}" r="{max(6, pr / 3):.0f}" fill="{WHITE}"/>')
        elif kind == "happy":   # closed ^ ^
            out.append(f'<path d="M {cx - 40} 606 Q {cx} 552 {cx + 40} 606" stroke="{INK}" stroke-width="14" fill="none" stroke-linecap="round"/>')
        elif kind == "squint":  # half-lidded, suspicious
            out.append(f'<ellipse cx="{cx}" cy="598" rx="52" ry="40" fill="{WHITE}" stroke="{INK}" stroke-width="10"/>')
            out.append(f'<circle cx="{cx + 14}" cy="606" r="22" fill="{INK}"/>')
            out.append(f'<path d="M {cx - 56} 590 Q {cx} 566 {cx + 56} 590 L {cx + 56} 556 L {cx - 56} 556 Z" fill="{STEEL}" stroke="none"/>')
            out.append(f'<path d="M {cx - 54} 590 Q {cx} 572 {cx + 54} 590" stroke="{INK}" stroke-width="10" fill="none" stroke-linecap="round"/>')
    return "".join(out)

def brows(kind):
    if kind == "neutral":
        a, b = "M 385 508 Q 425 490 468 504", "M 532 504 Q 575 490 615 508"
    elif kind == "up":
        a, b = "M 382 486 Q 425 462 468 480", "M 532 480 Q 575 462 618 486"
    elif kind == "worried":
        a, b = "M 385 500 Q 430 494 470 478", "M 530 478 Q 570 494 615 500"
    elif kind == "suspicious":
        a, b = "M 385 520 Q 428 530 470 540", "M 532 500 Q 575 482 618 494"
    else:
        a, b = "M 385 508 Q 425 490 468 504", "M 532 504 Q 575 490 615 508"
    return "".join(f'<path d="{d}" stroke="{INK}" stroke-width="16" fill="none" stroke-linecap="round"/>' for d in (a, b))

def mouth(kind):
    if kind == "smile":
        return (f'<path d="M 452 670 Q 500 726 548 670 Q 500 684 452 670 Z" fill="{MOUTH}" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
                f'<path d="M 478 694 Q 500 712 522 694 Q 500 688 478 694 Z" fill="{TONGUE}"/>')
    if kind == "big":
        return (f'<path d="M 440 664 Q 500 752 560 664 Q 500 680 440 664 Z" fill="{MOUTH}" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
                f'<path d="M 472 704 Q 500 730 528 704 Q 500 694 472 704 Z" fill="{TONGUE}"/>')
    if kind == "o":
        return f'<ellipse cx="500" cy="690" rx="26" ry="32" fill="{MOUTH}" stroke="{INK}" stroke-width="9"/>'
    if kind == "flat":
        return f'<path d="M 470 690 Q 500 684 534 694" stroke="{INK}" stroke-width="11" fill="none" stroke-linecap="round"/>'
    if kind == "wavy":
        return (f'<path d="M 448 690 Q 461 672 474 690 Q 487 708 500 690 Q 513 672 526 690 Q 539 708 552 690" '
                f'stroke="{INK}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    return ""

def seetu(expr="hero", silhouette=False):
    E = {
        "hero":      dict(eyes="open",   brows="neutral",    mouth="smile", blush=False, lid=0,   arm="wave",  steam=[]),
        "lidpop":    dict(eyes="wide",   brows="up",         mouth="o",     blush=False, lid=-105, tilt=-9, arm="up2", steam=[],
                          gap=["M 300 452 C 250 440 250 380 300 372 C 300 320 370 300 410 330 C 440 280 540 280 570 325 C 610 295 690 315 690 365 C 745 370 750 440 700 452 Z"]),
        "delighted": dict(eyes="happy",  brows="up",         mouth="big",   blush=True,  lid=0,   arm="cheeks", steam=["M 470 230 C 440 200 470 160 500 180 C 530 160 560 200 530 230 C 520 250 480 250 470 230 Z"]),
        "spicy":     dict(eyes="spicy",  brows="worried",    mouth="wavy",  blush=True,  lid=-22, tilt=4, arm="up2", flush=True,
                          steam=["M 440 225 C 405 190 440 140 478 165 C 495 120 560 130 556 180 C 600 190 590 245 545 242 C 525 262 470 262 440 225 Z"],
                          gap=["M 300 430 C 240 440 170 420 150 380 C 140 350 175 335 200 352 C 205 320 250 318 262 345 C 280 330 310 350 300 380 Z",
                               "M 700 430 C 760 440 830 420 850 380 C 860 350 825 335 800 352 C 795 320 750 318 738 345 C 720 330 690 350 700 380 Z"]),
        "squint":    dict(eyes="squint", brows="suspicious", mouth="flat",  blush=False, lid=0,   arm="chin",  steam=[]),
    }[expr]
    lid_dy = E["lid"]
    tilt = E.get("tilt", 0)
    p = []
    p.append(f'<defs><clipPath id="body-{expr}"><path d="{BODY}"/></clipPath></defs>')
    # steam behind lid
    if E["steam"]:
        p.append(steam(E["steam"]))
    # legs + shoes
    p.append(f'<path d="M 432 760 L 424 868 M 568 760 L 576 868" stroke="{INK}" stroke-width="16" stroke-linecap="round"/>')
    p.append(shoe(424, flip=True) + shoe(576))
    # arms (behind body edges)
    arms = {
        "wave":   ('M 264 612 C 215 628 190 662 176 702', (166, 718, 10), 'M 738 600 C 790 584 822 544 836 500', (842, 482, -20)),
        "up2":    ('M 262 600 C 205 580 180 530 172 478', (168, 458, 20), 'M 738 600 C 795 580 820 530 828 478', (832, 458, -20)),
        "cheeks": ('M 262 620 C 225 640 250 690 300 688', (318, 682, 70), 'M 738 620 C 775 640 750 690 700 688', (682, 682, -70)),
        "chin":   ('M 264 612 C 215 628 190 662 176 702', (166, 718, 10), 'M 738 610 C 760 660 700 720 600 740', (588, 738, -100)),
    }[E["arm"]]
    p.append(f'<path d="{arms[0]} M {arms[2] if False else ""}" />' if False else "")
    p.append(f'<path d="{arms[0]}" stroke="{INK}" stroke-width="16" fill="none" stroke-linecap="round"/>')
    p.append(f'<path d="{arms[2]}" stroke="{INK}" stroke-width="16" fill="none" stroke-linecap="round"/>')
    # long handle (character's RIGHT = viewer's left), drawn before body
    p.append(f'<g transform="translate(0 {lid_dy}) rotate({tilt} 500 420) rotate(-8 300 428)">'
             f'<rect x="78" y="406" width="232" height="42" rx="21" fill="#1E1E1E" stroke="{INK}" stroke-width="{SW}"/>'
             f'<path d="M 104 418 L 280 418" stroke="#4A4A4A" stroke-width="6" stroke-linecap="round"/>'
             f'<rect x="268" y="412" width="44" height="30" rx="6" fill="{STEEL}" stroke="{INK}" stroke-width="9"/></g>')
    # body
    p.append(f'<path d="{BODY}" fill="{STEEL}" stroke="none"/>')
    p.append(f'<g clip-path="url(#body-{expr})"><ellipse cx="775" cy="630" rx="150" ry="270" fill="{SHADE}"/>'
             f'<ellipse cx="318" cy="590" rx="22" ry="120" fill="{HI}"/>'
             f'<rect x="240" y="752" width="520" height="30" fill="{SHADE}" opacity="0.55"/></g>')
    if E.get("flush"):
        p.append(f'<g clip-path="url(#body-{expr})"><ellipse cx="500" cy="640" rx="260" ry="170" fill="{RED}" opacity="0.16"/></g>')
    p.append(f'<path d="{BODY}" fill="none" stroke="{INK}" stroke-width="{SW}" stroke-linejoin="round"/>')
    if E["blush"]:
        p.append(f'<ellipse cx="368" cy="660" rx="30" ry="17" fill="{BLUSH}" opacity="0.85"/><ellipse cx="632" cy="660" rx="30" ry="17" fill="{BLUSH}" opacity="0.85"/>')
    # face
    p.append(brows(E["brows"]) + eyes(E["eyes"]) + mouth(E["mouth"]))
    # mitts on top of body where relevant
    p.append(mitt(*arms[1]) + mitt(*arms[3]))
    # lid group (rim + dome + whistle), lifted for lid-pop
    if E.get("gap"):
        p.append(steam(E["gap"]))
    g = [f'<g transform="translate(0 {lid_dy}) rotate({tilt} 500 420)">']
    g.append(f'<path d="M 285 428 C 300 342, 400 318, 500 318 C 600 318, 700 342, 715 428 Z" fill="{STEEL}" stroke="{INK}" stroke-width="{SW}" stroke-linejoin="round"/>')
    g.append(f'<path d="M 340 386 C 370 352, 420 340, 455 338" stroke="{HI}" stroke-width="14" fill="none" stroke-linecap="round"/>')
    g.append(f'<rect x="268" y="416" width="464" height="36" rx="18" fill="{STEEL}" stroke="{INK}" stroke-width="{SW}"/>')
    g.append(f'<rect x="487" y="288" width="26" height="36" fill="{SHADE}" stroke="{INK}" stroke-width="8"/>')
    g.append(f'<rect x="466" y="244" width="68" height="56" rx="24" fill="{RED}" stroke="{INK}" stroke-width="{SW}"/>')
    g.append(f'<ellipse cx="486" cy="262" rx="9" ry="7" fill="{WHITE}" opacity="0.9"/>')
    g.append('</g>')
    p.append("".join(g))
    # scarf (on the gasket line; stays with the body)
    p.append(f'<path d="M 284 456 Q 500 498 716 456 L 726 498 Q 500 542 274 498 Z" fill="{TURMERIC}" stroke="{INK}" stroke-width="{SW}" stroke-linejoin="round"/>')
    p.append(f'<path d="M 282 474 Q 500 516 720 474 M 278 488 Q 500 530 724 488" stroke="{RED}" stroke-width="5" fill="none"/>')
    p.append(f'<path d="M 706 496 C 740 520 770 560 800 612 L 770 626 C 748 580 724 548 690 520 Z" fill="{TURMERIC}" stroke="{INK}" stroke-width="10" stroke-linejoin="round"/>')
    p.append(f'<path d="M 694 506 C 712 548 730 590 742 640 L 712 644 C 704 600 690 560 676 524 Z" fill="{TURMERIC}" stroke="{INK}" stroke-width="10" stroke-linejoin="round"/>')
    p.append(f'<path d="M 776 590 L 792 582 M 722 616 L 738 614" stroke="{RED}" stroke-width="6" stroke-linecap="round"/>')
    p.append(f'<ellipse cx="704" cy="498" rx="28" ry="24" fill="{TURMERIC}" stroke="{INK}" stroke-width="10"/>')
    svg = "".join(p)
    if silhouette:
        svg = f'<g filter="url(#sil)">{svg}</g>'
    return svg

def wrap(inner, w=1000, h=1000, bg=None, extra_defs=""):
    bgrect = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f'<defs><filter id="sil"><feColorMatrix type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.08  0 0 0 0 0.08  0 0 0 1 0"/></filter>{extra_defs}</defs>'
            f'{bgrect}{inner}</svg>')

if __name__ == "__main__":
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    poses = ["hero", "lidpop", "delighted", "spicy", "squint"]
    for name in poses:
        open(os.path.join(out, f"seetu-{name}.svg"), "w").write(wrap(seetu(name)))
    labels = {"hero": "1 · Hero (wave)", "lidpop": "2 · Lid-pop (hook / fact)", "delighted": "3 · Delighted",
              "spicy": "4 · Spicy (Steam-o-meter max)", "squint": "5 · “Every day… or just for guests?”", "sil": "6 · Silhouette test"}
    cells = poses + ["sil"]
    W, H, cw, ch = 1800, 1440, 600, 660
    parts = [f'<text x="900" y="62" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="{INK}">Seetu — vector rig v0.1 (0 credits)</text>']
    for i, name in enumerate(cells):
        cx, cy = (i % 3) * cw, 90 + (i // 3) * ch
        art = seetu("hero", silhouette=True) if name == "sil" else seetu(name)
        parts.append(f'<g transform="translate({cx + 20} {cy}) scale(0.56)">{art}</g>')
        parts.append(f'<text x="{cx + 300}" y="{cy + 618}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="{INK}">{labels[name]}</text>')
    open(os.path.join(out, "seetu-sheet.svg"), "w").write(wrap("".join(parts), W, H, bg="#FFF6E5"))
    print("wrote", len(poses), "poses + sheet to", out)
