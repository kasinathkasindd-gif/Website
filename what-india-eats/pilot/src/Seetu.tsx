import React from 'react';
import {INK, STEEL, HI, SHADE, RED, TURMERIC, WHITE, BLUSH, MOUTH, TONGUE} from './theme';

// Vector rig ported from library/seetu/build_seetu.py (approved design v0.1).
// Drawn in a 1000x1000 box; anchor = midpoint between the feet at (500, 905).

export type Eyes = 'open' | 'wide' | 'happy' | 'squint' | 'closed';
export type Brows = 'neutral' | 'up' | 'worried' | 'suspicious';
export type Mouth = 'smile' | 'big' | 'o' | 'flat' | 'wavy' | 'chew';
export type Arm = 'down' | 'wave' | 'up' | 'cheeks' | 'chin' | 'point' | 'stop' | 'hold' | 'warm';

export type SeetuProps = {
  id: string;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  rotate?: number;
  eyes?: Eyes;
  brows?: Brows;
  mouth?: Mouth;
  blush?: boolean;
  flush?: number; // 0..1 red tint
  lidLift?: number; // px (negative = up)
  lidTilt?: number; // deg
  steam?: string[]; // extra steam paths in rig space
  armL?: Arm;
  armR?: Arm;
  wave?: number; // 0..1 wave oscillation for 'wave' arms
  walk?: number | null; // walk phase in radians, null = standing
  blink?: boolean;
  look?: [number, number];
  squash?: number; // 1 = normal, <1 squashed
};

const BODY =
  'M 290 440 C 262 500, 248 560, 252 615 C 256 690, 280 750, 330 770 L 670 770 C 720 750, 744 690, 748 615 C 752 560, 738 500, 710 440 Z';

const Mitt: React.FC<{cx: number; cy: number; rot: number}> = ({cx, cy, rot}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
    <ellipse cx={0} cy={0} rx={30} ry={36} fill={TURMERIC} stroke={INK} strokeWidth={9} />
    <ellipse cx={-26} cy={6} rx={12} ry={18} transform="rotate(-25 -26 6)" fill={TURMERIC} stroke={INK} strokeWidth={9} />
    <rect x={-22} y={26} width={44} height={16} rx={7} fill={TURMERIC} stroke={INK} strokeWidth={8} />
  </g>
);

const Shoe: React.FC<{x: number; y: number; flip?: boolean}> = ({x, y, flip}) => (
  <g transform={`translate(${x} ${y - 892}) scale(${flip ? -1 : 1} 1)`}>
    <path d="M -38 892 Q -40 856 -2 856 Q 32 856 40 880 L 42 892 Z" fill={RED} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <rect x={-46} y={886} width={94} height={16} rx={8} fill={WHITE} stroke={INK} strokeWidth={9} />
    <path d="M -12 866 L 6 878 M -2 862 L 16 874" stroke={WHITE} strokeWidth={5} strokeLinecap="round" />
  </g>
);

type ArmDef = {d: string; mitt: [number, number, number]};
const armDef = (side: 'L' | 'R', pose: Arm, wave = 0): ArmDef => {
  const L: Record<Arm, ArmDef> = {
    down: {d: 'M 264 612 C 215 628 190 662 176 702', mitt: [166, 718, 10]},
    wave: {d: 'M 262 600 C 205 584 178 544 164 500', mitt: [158, 482, 20]},
    up: {d: 'M 262 600 C 205 580 180 530 172 478', mitt: [168, 458, 20]},
    cheeks: {d: 'M 262 620 C 225 640 250 690 300 688', mitt: [318, 682, 70]},
    chin: {d: 'M 262 610 C 240 660 300 720 400 740', mitt: [412, 738, 100]},
    point: {d: 'M 262 610 C 200 640 150 700 120 760', mitt: [108, 776, 35]},
    stop: {d: 'M 262 612 C 215 610 196 572 190 530', mitt: [188, 510, 10]},
    hold: {d: 'M 270 640 C 300 720 380 760 430 760', mitt: [440, 760, 80]},
    warm: {d: 'M 268 650 C 300 730 360 770 420 790', mitt: [432, 792, 95]},
  };
  if (side === 'L') return L[pose];
  // mirror for the right arm (x -> 1000 - x)
  const m = L[pose];
  const d = m.d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_s, a, b) => `${1000 - Number(a)} ${b}`);
  let [mx, my, mr] = m.mitt;
  mx = 1000 - mx;
  mr = -mr;
  if (pose === 'wave') {
    // oscillate the forearm around the elbow
    const a = Math.sin(wave * Math.PI * 2) * 14;
    mx += a;
    mr += a * 0.8;
    const d2 = `M 738 600 C 795 584 ${822 + a * 0.4} 544 ${836 + a} 500`;
    return {d: d2, mitt: [mx, my, mr]};
  }
  return {d, mitt: [mx, my, mr]};
};

const EyesG: React.FC<{kind: Eyes; look: [number, number]; blink: boolean}> = ({kind, look, blink}) => {
  const out: React.ReactNode[] = [];
  const k = blink && (kind === 'open' || kind === 'wide') ? 'closed' : kind;
  [430, 570].forEach((cx, i) => {
    const side = i === 0 ? -1 : 1;
    if (k === 'open' || k === 'wide') {
      const [rx, ry] = k === 'open' ? [52, 64] : [58, 72];
      const pr = k === 'open' ? 30 : 18;
      const px = (k === 'open' ? cx - side * 7 : cx) + look[0];
      const py = 598 + look[1];
      out.push(<ellipse key={`e${i}`} cx={cx} cy={590} rx={rx} ry={ry} fill={WHITE} stroke={INK} strokeWidth={10} />);
      out.push(<circle key={`p${i}`} cx={px} cy={py} r={pr} fill={INK} />);
      out.push(<circle key={`h${i}`} cx={px + 10} cy={py - pr * 0.45} r={Math.max(6, pr / 3)} fill={WHITE} />);
    } else if (k === 'happy') {
      out.push(<path key={`e${i}`} d={`M ${cx - 40} 606 Q ${cx} 552 ${cx + 40} 606`} stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />);
    } else if (k === 'closed') {
      out.push(<path key={`e${i}`} d={`M ${cx - 44} 596 Q ${cx} 620 ${cx + 44} 596`} stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" />);
    } else if (k === 'squint') {
      out.push(<ellipse key={`e${i}`} cx={cx} cy={598} rx={52} ry={40} fill={WHITE} stroke={INK} strokeWidth={10} />);
      out.push(<circle key={`p${i}`} cx={cx + 14 + look[0]} cy={606} r={22} fill={INK} />);
      out.push(<path key={`l${i}`} d={`M ${cx - 56} 590 Q ${cx} 566 ${cx + 56} 590 L ${cx + 56} 556 L ${cx - 56} 556 Z`} fill={STEEL} />);
      out.push(<path key={`ll${i}`} d={`M ${cx - 54} 590 Q ${cx} 572 ${cx + 54} 590`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />);
    }
  });
  return <g>{out}</g>;
};

const BROWS: Record<Brows, [string, string]> = {
  neutral: ['M 385 508 Q 425 490 468 504', 'M 532 504 Q 575 490 615 508'],
  up: ['M 382 486 Q 425 462 468 480', 'M 532 480 Q 575 462 618 486'],
  worried: ['M 385 500 Q 430 494 470 478', 'M 530 478 Q 570 494 615 500'],
  suspicious: ['M 385 520 Q 428 530 470 540', 'M 532 500 Q 575 482 618 494'],
};

const MouthG: React.FC<{kind: Mouth}> = ({kind}) => {
  switch (kind) {
    case 'smile':
      return (
        <g>
          <path d="M 452 670 Q 500 726 548 670 Q 500 684 452 670 Z" fill={MOUTH} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <path d="M 478 694 Q 500 712 522 694 Q 500 688 478 694 Z" fill={TONGUE} />
        </g>
      );
    case 'big':
      return (
        <g>
          <path d="M 440 664 Q 500 752 560 664 Q 500 680 440 664 Z" fill={MOUTH} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <path d="M 472 704 Q 500 730 528 704 Q 500 694 472 704 Z" fill={TONGUE} />
        </g>
      );
    case 'o':
      return <ellipse cx={500} cy={690} rx={26} ry={32} fill={MOUTH} stroke={INK} strokeWidth={9} />;
    case 'flat':
      return <path d="M 470 690 Q 500 684 534 694" stroke={INK} strokeWidth={11} fill="none" strokeLinecap="round" />;
    case 'wavy':
      return (
        <path
          d="M 448 690 Q 461 672 474 690 Q 487 708 500 690 Q 513 672 526 690 Q 539 708 552 690"
          stroke={INK}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'chew':
      return <path d="M 462 684 Q 482 700 500 686 Q 518 700 538 684" stroke={INK} strokeWidth={11} fill="none" strokeLinecap="round" />;
  }
};

export const steamPath = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} C ${cx - r * 1.2} ${cy - r * 0.9} ${cx - r * 0.3} ${cy - r * 1.5} ${cx} ${cy - r * 0.9} ` +
  `C ${cx + r * 0.4} ${cy - r * 1.6} ${cx + r * 1.4} ${cy - r * 0.9} ${cx + r} ${cy} ` +
  `C ${cx + r * 1.2} ${cy + r * 0.6} ${cx - r * 1.2} ${cy + r * 0.6} ${cx - r} ${cy} Z`;

export const STEAM_POP = [
  'M 300 452 C 250 440 250 380 300 372 C 300 320 370 300 410 330 C 440 280 540 280 570 325 C 610 295 690 315 690 365 C 745 370 750 440 700 452 Z',
];
export const STEAM_SPICY = [
  'M 300 430 C 240 440 170 420 150 380 C 140 350 175 335 200 352 C 205 320 250 318 262 345 C 280 330 310 350 300 380 Z',
  'M 700 430 C 760 440 830 420 850 380 C 860 350 825 335 800 352 C 795 320 750 318 738 345 C 720 330 690 350 700 380 Z',
];

export const Seetu: React.FC<SeetuProps> = ({
  id,
  x,
  y,
  scale = 1,
  flip = false,
  rotate = 0,
  eyes = 'open',
  brows = 'neutral',
  mouth = 'smile',
  blush = false,
  flush = 0,
  lidLift = 0,
  lidTilt = 0,
  steam = [],
  armL = 'down',
  armR = 'down',
  wave = 0,
  walk = null,
  blink = false,
  look = [0, 0],
  squash = 1,
}) => {
  const aL = armDef('L', armL, wave);
  const aR = armDef('R', armR, wave);
  // walk cycle: feet swing and lift, body bobs
  const ph = walk ?? 0;
  const fL = walk === null ? [0, 0] : [Math.sin(ph) * 22, -Math.max(0, Math.sin(ph)) * 16];
  const fR = walk === null ? [0, 0] : [-Math.sin(ph) * 22, -Math.max(0, -Math.sin(ph)) * 16];
  const bob = walk === null ? 0 : -Math.abs(Math.sin(ph)) * 10;
  const sx = flip ? -scale : scale;
  const t = `translate(${x} ${y}) rotate(${rotate}) scale(${sx} ${scale}) translate(-500 -905)`;
  const body = `translate(0 ${bob}) translate(500 770) scale(${1 + (1 - squash) * 0.6} ${squash}) translate(-500 -770)`;
  const lid = `translate(0 ${lidLift}) rotate(${lidTilt} 500 420)`;
  return (
    <g transform={t}>
      <defs>
        <clipPath id={`body-${id}`}>
          <path d={BODY} />
        </clipPath>
      </defs>
      {/* legs + shoes */}
      <path
        d={`M 432 760 L ${424 + fL[0]} ${868 + fL[1]} M 568 760 L ${576 + fR[0]} ${868 + fR[1]}`}
        stroke={INK}
        strokeWidth={16}
        strokeLinecap="round"
      />
      <Shoe x={424 + fL[0]} y={892 + fL[1]} flip />
      <Shoe x={576 + fR[0]} y={892 + fR[1]} />
      <g transform={body}>
        {/* arms behind body */}
        <path d={aL.d} stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
        <path d={aR.d} stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
        {/* long handle travels with the lid */}
        <g transform={lid}>
          <g transform="rotate(-8 300 428)">
            <rect x={78} y={406} width={232} height={42} rx={21} fill="#1E1E1E" stroke={INK} strokeWidth={12} />
            <path d="M 104 418 L 280 418" stroke="#4A4A4A" strokeWidth={6} strokeLinecap="round" />
            <rect x={268} y={412} width={44} height={30} rx={6} fill={STEEL} stroke={INK} strokeWidth={9} />
          </g>
        </g>
        {/* body */}
        <path d={BODY} fill={STEEL} />
        <g clipPath={`url(#body-${id})`}>
          <ellipse cx={775} cy={630} rx={150} ry={270} fill={SHADE} />
          <ellipse cx={318} cy={590} rx={22} ry={120} fill={HI} />
          <rect x={240} y={752} width={520} height={30} fill={SHADE} opacity={0.55} />
          {flush > 0 && <ellipse cx={500} cy={640} rx={260} ry={170} fill={RED} opacity={0.16 * flush} />}
        </g>
        <path d={BODY} fill="none" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
        {blush && (
          <g>
            <ellipse cx={368} cy={660} rx={30} ry={17} fill={BLUSH} opacity={0.85} />
            <ellipse cx={632} cy={660} rx={30} ry={17} fill={BLUSH} opacity={0.85} />
          </g>
        )}
        {/* face */}
        {BROWS[brows].map((d, i) => (
          <path key={i} d={d} stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
        ))}
        <EyesG kind={eyes} look={look} blink={blink} />
        <MouthG kind={mouth} />
        <Mitt cx={aL.mitt[0]} cy={aL.mitt[1]} rot={aL.mitt[2]} />
        <Mitt cx={aR.mitt[0]} cy={aR.mitt[1]} rot={aR.mitt[2]} />
        {/* steam (in the lid gap / around) */}
        {steam.map((d, i) => (
          <path key={i} d={d} fill={WHITE} fillOpacity={0.94} stroke={SHADE} strokeWidth={6} />
        ))}
        {/* lid: dome + rim + whistle */}
        <g transform={lid}>
          <path d="M 285 428 C 300 342, 400 318, 500 318 C 600 318, 700 342, 715 428 Z" fill={STEEL} stroke={INK} strokeWidth={12} strokeLinejoin="round" />
          <path d="M 340 386 C 370 352, 420 340, 455 338" stroke={HI} strokeWidth={14} fill="none" strokeLinecap="round" />
          <rect x={268} y={416} width={464} height={36} rx={18} fill={STEEL} stroke={INK} strokeWidth={12} />
          <rect x={487} y={288} width={26} height={36} fill={SHADE} stroke={INK} strokeWidth={8} />
          <rect x={466} y={244} width={68} height={56} rx={24} fill={RED} stroke={INK} strokeWidth={12} />
          <ellipse cx={486} cy={262} rx={9} ry={7} fill={WHITE} opacity={0.9} />
        </g>
        {/* scarf on the gasket line */}
        <path d="M 284 456 Q 500 498 716 456 L 726 498 Q 500 542 274 498 Z" fill={TURMERIC} stroke={INK} strokeWidth={12} strokeLinejoin="round" />
        <path d="M 282 474 Q 500 516 720 474 M 278 488 Q 500 530 724 488" stroke={RED} strokeWidth={5} fill="none" />
        <path d="M 706 496 C 740 520 770 560 800 612 L 770 626 C 748 580 724 548 690 520 Z" fill={TURMERIC} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <path d="M 694 506 C 712 548 730 590 742 640 L 712 644 C 704 600 690 560 676 524 Z" fill={TURMERIC} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <path d="M 776 590 L 792 582 M 722 616 L 738 614" stroke={RED} strokeWidth={6} strokeLinecap="round" />
        <ellipse cx={704} cy={498} rx={28} ry={24} fill={TURMERIC} stroke={INK} strokeWidth={10} />
      </g>
    </g>
  );
};

// Deterministic blink helper: closed for 3 frames every ~2.6 s, offset per character
export const isBlinking = (frame: number, offset = 0) => {
  const p = (frame + offset) % 78;
  return p < 3;
};
