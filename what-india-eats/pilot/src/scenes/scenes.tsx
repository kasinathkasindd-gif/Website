import React from 'react';
import {
  INK, STEEL, HI, SHADE, RED, TURMERIC, WHITE, SKY, SKY_DEEP, MOUNTAIN, MOUNTAIN_DARK, SNOW,
  WALL, WOOD, WOOD_DARK, COPPER, BRASS, NIGHT, CREAM, FONT_HEAD, FONT_BODY,
} from '../theme';

// Deterministic pseudo-random (for snow, grains)
export const rand = (seed: number) => {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const SKIN = '#A86B47';
const SLEEVE = '#7B2D3B';

// ---------------------------------------------------------------- Ladakhi kitchen
const Pot: React.FC<{x: number; y: number; w: number; h: number; c: string}> = ({x, y, w, h, c}) => (
  <g>
    <path d={`M ${x - w / 2} ${y} C ${x - w / 2} ${y - h * 0.9} ${x - w * 0.28} ${y - h} ${x - w * 0.22} ${y - h} L ${x + w * 0.22} ${y - h} C ${x + w * 0.28} ${y - h} ${x + w / 2} ${y - h * 0.9} ${x + w / 2} ${y} Z`} fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={x - w * 0.26} y={y - h - 12} width={w * 0.52} height={14} rx={6} fill={c} stroke={INK} strokeWidth={6} />
    <path d={`M ${x - w * 0.3} ${y - h * 0.62} Q ${x - w * 0.2} ${y - h * 0.82} ${x - w * 0.05} ${y - h * 0.86}`} stroke="#FFF2C9" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
  </g>
);

const LadakhiWindow: React.FC<{x: number; y: number; w: number; h: number; night?: boolean; t?: number}> = ({x, y, w, h, night, t = 0}) => {
  const r = rand(7);
  const flakes = Array.from({length: 26}, () => [r(), r(), 3 + r() * 5]);
  return (
    <g>
      {/* black trapezoid surround, typical of Ladakhi/Himalayan windows */}
      <path d={`M ${x - 40} ${y + h + 40} L ${x + w + 40} ${y + h + 40} L ${x + w + 18} ${y - 26} L ${x - 18} ${y - 26} Z`} fill="#2A2A2A" />
      <rect x={x} y={y} width={w} height={h} fill={night ? NIGHT : SKY} />
      <clipPath id={`win-${x}-${night ? 'n' : 'd'}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#win-${x}-${night ? 'n' : 'd'})`}>
        <path d={`M ${x - 10} ${y + h} L ${x + w * 0.3} ${y + h * 0.45} L ${x + w * 0.5} ${y + h * 0.62} L ${x + w * 0.78} ${y + h * 0.35} L ${x + w + 20} ${y + h} Z`} fill={night ? '#3B4A73' : MOUNTAIN} />
        <path d={`M ${x + w * 0.3} ${y + h * 0.45} L ${x + w * 0.24} ${y + h * 0.53} L ${x + w * 0.36} ${y + h * 0.52} Z M ${x + w * 0.78} ${y + h * 0.35} L ${x + w * 0.7} ${y + h * 0.46} L ${x + w * 0.86} ${y + h * 0.45} Z`} fill={SNOW} opacity={night ? 0.7 : 1} />
        {night &&
          flakes.map(([fx, fy, s], i) => {
            const yy = y + ((fy * h + t * 60 * (0.5 + s / 8)) % h);
            const xx = x + fx * w + Math.sin(t * 2 + i) * 6;
            return <circle key={i} cx={xx} cy={yy} r={s} fill={WHITE} opacity={0.9} />;
          })}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={WOOD_DARK} strokeWidth={22} />
      <path d={`M ${x + w / 2} ${y} L ${x + w / 2} ${y + h} M ${x} ${y + h / 2} L ${x + w} ${y + h / 2}`} stroke={WOOD_DARK} strokeWidth={14} />
      <rect x={x - 30} y={y - 46} width={w + 60} height={26} fill={WOOD} stroke={INK} strokeWidth={6} />
    </g>
  );
};

export const KitchenBG: React.FC<{night?: boolean; t?: number; stove?: boolean}> = ({night, t = 0, stove = true}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
    <defs>
      <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFD27A" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FFD27A" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={WALL} />
    <rect y={1150} width={1080} height={360} fill="#E6D1AE" />
    <rect y={1500} width={1080} height={420} fill={WOOD} />
    {[1590, 1700, 1830].map((yy) => (
      <path key={yy} d={`M 0 ${yy} L 1080 ${yy}`} stroke={WOOD_DARK} strokeWidth={6} opacity={0.45} />
    ))}
    <LadakhiWindow x={110} y={360} w={300} h={380} night={night} t={t} />
    {/* shelves of copper and brass vessels */}
    {[470, 640, 810].map((sy, i) => (
      <g key={sy}>
        <rect x={560} y={sy} width={470} height={26} fill={WOOD} stroke={INK} strokeWidth={6} />
        {[0, 1, 2, 3].map((j) => (
          <Pot key={j} x={612 + j * 112 + (i % 2) * 20} y={sy} w={j % 2 ? 86 : 104} h={j % 2 ? 100 : 126 - i * 8} c={(i + j) % 2 ? COPPER : BRASS} />
        ))}
      </g>
    ))}
    {/* iron stove with chimney */}
    {stove && (
      <g>
        <rect x={852} y={0} width={46} height={1000} fill="#2B2B2B" stroke={INK} strokeWidth={6} />
        <rect x={740} y={980} width={300} height={360} rx={18} fill="#3A3A3A" stroke={INK} strokeWidth={8} />
        <rect x={780} y={1080} width={140} height={120} rx={10} fill="#262626" stroke={INK} strokeWidth={6} />
        <rect x={800} y={1100} width={100} height={80} rx={8} fill={night ? '#FF8A3D' : '#E0622B'} opacity={0.85} />
        <rect x={728} y={968} width={324} height={26} rx={8} fill="#4A4A4A" stroke={INK} strokeWidth={6} />
      </g>
    )}
    {/* low painted table (chogtse-style), geometric pattern only */}
    <rect x={60} y={1150} width={760} height={44} rx={10} fill={WOOD} stroke={INK} strokeWidth={8} />
    <rect x={90} y={1194} width={700} height={250} fill="#8B2E2A" stroke={INK} strokeWidth={8} />
    <path d="M 110 1214 L 770 1214 L 770 1424 L 110 1424 Z" fill="none" stroke={TURMERIC} strokeWidth={6} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M ${170 + i * 135} 1319 l 40 -50 l 40 50 l -40 50 Z`} fill="none" stroke={TURMERIC} strokeWidth={6} />
    ))}
    {night && (
      <g>
        <rect width={1080} height={1920} fill="#1B2448" opacity={0.28} />
        <circle cx={430} cy={1070} r={520} fill="url(#lamp)" />
      </g>
    )}
  </svg>
);

// ---------------------------------------------------------------- Leh exterior
export const ExteriorBG: React.FC = () => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={SKY_DEEP} />
        <stop offset="1" stopColor={SKY} />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#sky)" />
    <rect y={1300} width={1080} height={620} fill="#D8C3A0" />
    <g transform="translate(0 -180)">
    <path d="M -40 980 L 160 560 L 300 760 L 470 470 L 650 780 L 820 540 L 1120 980 Z" fill="#C9A27E" />
    <path d="M 160 560 L 120 650 L 205 640 Z M 470 470 L 420 570 L 520 560 Z M 820 540 L 770 630 L 870 625 Z" fill={SNOW} />
    <path d="M -40 1120 L 120 860 L 330 1000 L 560 820 L 760 1010 L 960 860 L 1120 1120 Z" fill={MOUNTAIN} />
    <path d="M -40 1300 L 200 1110 L 440 1220 L 700 1100 L 1120 1300 Z" fill={MOUNTAIN_DARK} />
    <rect y={1290} width={1080} height={630} fill="#D8C3A0" />
    {/* golden poplars */}
    {[700, 790, 880, 960].map((px, i) => (
      <g key={px}>
        <rect x={px - 6} y={1150 - (i % 2) * 30} width={12} height={170} fill={WOOD_DARK} />
        <ellipse cx={px} cy={1080 - (i % 2) * 30} rx={34} ry={120} fill={i % 2 ? '#E2B13C' : '#D49A2A'} stroke={INK} strokeWidth={6} />
      </g>
    ))}
    {/* whitewashed flat-roof house */}
    <rect x={110} y={1000} width={440} height={320} fill="#FAFAF5" stroke={INK} strokeWidth={8} />
    <rect x={96} y={968} width={468} height={40} fill={WOOD_DARK} stroke={INK} strokeWidth={8} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
      <path key={i} d={`M ${110 + i * 42} 968 l 10 -26 l 10 26`} stroke={WOOD} strokeWidth={6} fill="none" />
    ))}
    {[160, 400].map((wx) => (
      <g key={wx}>
        <path d={`M ${wx - 16} 1182 L ${wx + 116} 1182 L ${wx + 104} 1056 L ${wx - 4} 1056 Z`} fill="#2A2A2A" />
        <rect x={wx} y={1070} width={100} height={100} fill="#3B5C7A" stroke={WOOD_DARK} strokeWidth={10} />
      </g>
    ))}
    <rect x={290} y={1170} width={80} height={150} fill={WOOD} stroke={INK} strokeWidth={8} />
    {/* road */}
    <path d="M -20 1500 L 1100 1440 L 1100 1640 L -20 1700 Z" fill="#BFAE8E" />
    <path d="M 40 1594 L 160 1588 M 320 1580 L 440 1574 M 600 1566 L 720 1560 M 880 1552 L 1000 1546" stroke={CREAM} strokeWidth={10} strokeLinecap="round" />
    </g>
  </svg>
);

export const Jeep: React.FC<{x: number; y: number; bounce?: number; doorOpen?: number}> = ({x, y, bounce = 0, doorOpen = 0}) => (
  <g transform={`translate(${x} ${y + bounce}) scale(-1 1)`}>
    <path d="M -230 -40 L -210 -150 Q -200 -175 -170 -178 L 120 -178 Q 150 -176 170 -140 L 215 -70 L 240 -60 Q 255 -55 255 -35 L 255 0 L -230 0 Z" fill="#F3F3EE" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M -190 -150 L 110 -150 L 155 -82 L -200 -82 Z" fill="#A9C8DE" stroke={INK} strokeWidth={7} />
    <path d="M -40 -150 L -40 -82 M 50 -150 L 50 -82" stroke={INK} strokeWidth={7} />
    <rect x={-120} y={-188} width={180} height={14} rx={6} fill="#555" stroke={INK} strokeWidth={6} />
    <path d="M -230 -30 L 255 -30" stroke={RED} strokeWidth={8} />
    <g transform={`rotate(${-doorOpen * 35} -40 -82)`}>
      <rect x={-40} y={-82} width={90} height={70} fill="#ECECE6" stroke={INK} strokeWidth={6} opacity={doorOpen > 0 ? 1 : 0} />
    </g>
    {[-140, 160].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={0} r={48} fill="#2A2A2A" stroke={INK} strokeWidth={8} />
        <circle cx={wx} cy={0} r={20} fill={STEEL} stroke={INK} strokeWidth={6} />
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- Journey graphic (no national-border map)
export const ROUTE_STOPS: [string, number, number][] = [
  ['Leh', 330, 560],
  ['Changthang', 750, 634],
  ['Nubra', 330, 708],
  ['Sham', 750, 782],
  ['Kargil', 330, 856],
  ['Drass', 750, 930],
  ['Sankoo', 330, 1004],
  ['Zanskar', 750, 1078],
];
export const RouteBG: React.FC<{progress?: number; stamped?: boolean; highlight?: number}> = ({progress = 1, stamped = false, highlight = 0}) => {
  const d = ROUTE_STOPS.map(([, x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
      <rect width={1080} height={1920} fill="#1E2F57" />
      {Array.from({length: 40}, (_, i) => {
        const r = rand(i + 11);
        return <circle key={i} cx={r() * 1080} cy={r() * 1920} r={2 + r() * 3} fill={WHITE} opacity={0.25 + r() * 0.4} />;
      })}
      <text x={540} y={330} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={56} fill={TURMERIC}>SEASON 1 · LADAKH</text>
      <text x={540} y={388} textAnchor="middle" fontFamily={FONT_BODY} fontSize={36} fill={WHITE} opacity={0.85}>8 districts · stop 1 of 793</text>
      <path d={d} stroke={WHITE} strokeWidth={10} strokeDasharray="4 26" strokeLinecap="round" fill="none" opacity={0.55} pathLength={1} strokeDashoffset={0} style={{}} />
      {ROUTE_STOPS.map(([name, x, y], i) => {
        const on = i <= highlight;
        const vis = Math.min(1, Math.max(0, progress * ROUTE_STOPS.length - i));
        return (
          <g key={name} opacity={vis}>
            <circle cx={x} cy={y} r={i === highlight ? 30 : 20} fill={on ? RED : '#3B4F80'} stroke={WHITE} strokeWidth={6} />
            <text x={x + (x < 540 ? 50 : -50)} y={y + 14} textAnchor={x < 540 ? 'start' : 'end'} fontFamily={FONT_HEAD} fontSize={i === highlight ? 44 : 34} fill={WHITE} opacity={on ? 1 : 0.6}>
              {i + 1} · {name}
            </text>
            {stamped && i === 0 && (
              <g transform={`translate(${x} ${y}) rotate(-12)`}>
                <circle r={62} fill="none" stroke={RED} strokeWidth={8} />
                <path d="M -26 0 L -6 22 L 30 -22" stroke={RED} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------- Burst background (hook)
export const BurstBG: React.FC<{t?: number; c1?: string; c2?: string}> = ({t = 0, c1 = TURMERIC, c2 = '#FFD34D'}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
    <rect width={1080} height={1920} fill={c1} />
    <g transform={`translate(540 980) rotate(${t * 12})`}>
      {Array.from({length: 18}, (_, i) => (
        <path key={i} d="M 0 0 L -120 -1500 L 120 -1500 Z" fill={c2} transform={`rotate(${i * 20})`} />
      ))}
    </g>
  </svg>
);

// ---------------------------------------------------------------- Food & props (rig-free, draw at absolute coords)
export const Steam: React.FC<{x: number; y: number; t: number; n?: number; scale?: number}> = ({x, y, t, n = 3, scale = 1}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const p = (t * 0.6 + i / n) % 1;
      const yy = y - p * 220 * scale;
      const xx = x + (i - (n - 1) / 2) * 40 * scale + Math.sin(p * 6 + i) * 18 * scale;
      return (
        <path
          key={i}
          d={`M ${xx} ${yy + 60 * scale} C ${xx - 26 * scale} ${yy + 30 * scale} ${xx + 26 * scale} ${yy + 10 * scale} ${xx} ${yy - 20 * scale}`}
          stroke={WHITE}
          strokeWidth={14 * scale}
          fill="none"
          strokeLinecap="round"
          opacity={Math.sin(p * Math.PI) * 0.9}
        />
      );
    })}
  </g>
);

export const TeaCup: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={230} ry={40} fill="#E9E4DA" stroke={INK} strokeWidth={9} />
    <path d="M -160 -170 L 160 -170 C 150 -40 110 0 0 0 C -110 0 -150 -40 -160 -170 Z" fill="#FBFAF6" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <path d="M 152 -130 C 230 -140 230 -50 140 -50" stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d="M 152 -130 C 214 -136 214 -62 140 -60" stroke="#FBFAF6" strokeWidth={8} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-170} rx={160} ry={32} fill="#D8BE93" stroke={INK} strokeWidth={9} />
    <ellipse cx={-40} cy={-176} rx={60} ry={10} fill="#E9D6B2" />
    <path d="M -120 -100 L 120 -100" stroke="#C9D5E3" strokeWidth={10} />
  </g>
);

export const Churn: React.FC<{x: number; y: number; plunge: number}> = ({x, y, plunge}) => (
  <g transform={`translate(${x} ${y})`}>
    {/* rod + handle (moves) */}
    <g transform={`translate(0 ${plunge * 70})`}>
      <rect x={-8} y={-560} width={16} height={260} fill={WOOD_DARK} stroke={INK} strokeWidth={5} />
      <rect x={-40} y={-574} width={80} height={22} rx={10} fill={WOOD} stroke={INK} strokeWidth={6} />
      {/* host hand gripping */}
      <path d="M 40 -640 C 30 -600 16 -580 6 -566" stroke={SLEEVE} strokeWidth={46} strokeLinecap="round" fill="none" />
      <ellipse cx={0} cy={-566} rx={34} ry={26} fill={SKIN} stroke={INK} strokeWidth={6} />
    </g>
    <rect x={-58} y={-380} width={116} height={380} rx={14} fill={WOOD} stroke={INK} strokeWidth={9} />
    {[-340, -200, -60].map((by) => (
      <rect key={by} x={-64} y={by} width={128} height={22} rx={6} fill={BRASS} stroke={INK} strokeWidth={6} />
    ))}
    <path d="M -36 -360 L -36 -20" stroke="#B9875C" strokeWidth={8} opacity={0.6} />
  </g>
);

export const BarleyBowl: React.FC<{x: number; y: number; dough: number}> = ({x, y, dough}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -150 -70 C -140 0 -90 20 0 20 C 90 20 140 0 150 -70 Z" fill={WOOD} stroke={INK} strokeWidth={9} />
    <ellipse cx={0} cy={-70} rx={150} ry={30} fill="#D2B48C" stroke={INK} strokeWidth={8} />
    {dough > 0 && <ellipse cx={-10} cy={-96 + (1 - dough) * 20} rx={70 * dough} ry={52 * dough} fill="#C49A6C" stroke={INK} strokeWidth={8} />}
    {dough > 0 && <path d={`M ${-40 * dough} ${-110} q ${20 * dough} ${-14 * dough} ${44 * dough} ${-4 * dough}`} stroke="#E0BE90" strokeWidth={6} fill="none" strokeLinecap="round" />}
  </g>
);

export const Kettle: React.FC<{x: number; y: number; tilt: number; pour: number}> = ({x, y, tilt, pour}) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
    {pour > 0 && <path d={`M 120 -40 C 150 0 160 ${60 + pour * 80} 160 ${120 + pour * 140}`} stroke="#D8BE93" strokeWidth={18} fill="none" strokeLinecap="round" />}
    <path d="M -90 0 C -100 -110 -60 -140 0 -140 C 60 -140 100 -110 90 0 Z" fill={COPPER} stroke={INK} strokeWidth={9} />
    <path d="M 80 -60 L 140 -70 L 128 -40 L 86 -30 Z" fill={COPPER} stroke={INK} strokeWidth={8} />
    <path d="M -60 -130 C -60 -200 60 -200 60 -130" stroke={INK} strokeWidth={14} fill="none" />
    <ellipse cx={0} cy={-140} rx={40} ry={10} fill={BRASS} stroke={INK} strokeWidth={6} />
  </g>
);

export const Khambir: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={120} ry={52} fill="#A86A33" stroke={INK} strokeWidth={9} />
    <ellipse cx={0} cy={-14} rx={104} ry={40} fill="#C68848" />
    <ellipse cx={0} cy={-16} rx={30} ry={12} fill="#8F5528" stroke={INK} strokeWidth={5} />
    <path d="M -70 -30 Q -40 -46 -10 -44" stroke="#E2B07A" strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);

export const Thali: React.FC<{x: number; y: number; rice?: number}> = ({x, y, rice = 1}) => {
  const r = rand(3);
  const grains = Array.from({length: 26}, () => [(r() - 0.5) * 150 * rice, -20 - r() * 70 * rice]);
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={300} ry={70} fill={STEEL} stroke={INK} strokeWidth={9} />
      <ellipse cx={0} cy={-6} rx={262} ry={54} fill={HI} />
      {/* rice mound */}
      <path d={`M ${-170 * rice - 30} 6 C ${-160 * rice - 20} ${-110 * rice} ${-40} ${-120 * rice} 20 6 Z`} fill={WHITE} stroke={INK} strokeWidth={8} />
      {grains.map(([gx, gy], i) => (
        <ellipse key={i} cx={-80 + gx * 0.6} cy={gy * 0.9} rx={7} ry={3} fill="#E9E9E2" />
      ))}
      {/* dal in a steel bowl */}
      <path d="M 70 -10 C 76 30 200 30 206 -10 Z" fill={SHADE} stroke={INK} strokeWidth={7} />
      <ellipse cx={138} cy={-10} rx={68} ry={18} fill="#E8B53A" stroke={INK} strokeWidth={7} />
      {/* potato-turnip sabzi */}
      {[[220, 10, '#E9A93A'], [250, -6, '#F3EBDD'], [205, -16, '#E9A93A'], [262, 18, '#E9A93A'], [236, -22, '#F3EBDD']].map(([cx, cy, c], i) => (
        <rect key={i} x={(cx as number) - 16} y={(cy as number) - 14} width={30} height={26} rx={7} fill={c as string} stroke={INK} strokeWidth={5} />
      ))}
    </g>
  );
};

export const ThukpaBowl: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -190 -60 C -180 40 -110 80 0 80 C 110 80 180 40 190 -60 Z" fill="#3E7C8C" stroke={INK} strokeWidth={10} />
    <path d="M -150 20 C -100 50 100 50 150 20" stroke="#5FA0B0" strokeWidth={10} fill="none" />
    <ellipse cx={0} cy={-60} rx={190} ry={40} fill="#E8C98B" stroke={INK} strokeWidth={9} />
    {[-120, -70, -20, 30, 80].map((nx, i) => (
      <path key={i} d={`M ${nx} -54 q 14 -18 28 0 q 14 18 28 0`} stroke="#FFF3D6" strokeWidth={8} fill="none" strokeLinecap="round" />
    ))}
    <ellipse cx={-90} cy={-72} rx={26} ry={10} fill="#5E9C3C" stroke={INK} strokeWidth={4} />
    <ellipse cx={60} cy={-76} rx={22} ry={9} fill="#5E9C3C" stroke={INK} strokeWidth={4} />
    <rect x={10} y={-70} width={22} height={14} rx={4} fill="#E07B39" stroke={INK} strokeWidth={4} />
    <rect x={-40} y={-64} width={24} height={16} rx={5} fill="#8B5A3C" stroke={INK} strokeWidth={4} />
  </g>
);

export const CousinCooker: React.FC<{x: number; y: number; jet: number}> = ({x, y, jet}) => (
  <g transform={`translate(${x} ${y}) scale(0.55)`}>
    {jet > 0 && (
      <path
        d={`M 0 -260 C ${-40 * jet} ${-360 * jet} ${40 * jet} ${-440 * jet} 0 ${-560 * jet} C ${60 * jet} ${-440 * jet} ${90 * jet} ${-360 * jet} 30 -260 Z`}
        fill={WHITE}
        fillOpacity={0.95}
        stroke={SHADE}
        strokeWidth={8}
      />
    )}
    <rect x={-210} y={-170} width={420} height={170} rx={30} fill={STEEL} stroke={INK} strokeWidth={14} />
    <path d="M -190 -170 C -180 -230 -90 -250 0 -250 C 90 -250 180 -230 190 -170 Z" fill={STEEL} stroke={INK} strokeWidth={14} />
    <rect x={-20} y={-300} width={40} height={52} rx={14} fill="#333" stroke={INK} strokeWidth={10} />
    <rect x={200} y={-190} width={220} height={40} rx={20} fill="#1E1E1E" stroke={INK} strokeWidth={12} />
  </g>
);

export const HostHandLadle: React.FC<{x: number; y: number; tip: number}> = ({x, y, tip}) => (
  <g transform={`translate(${x} ${y}) rotate(${-tip * 35})`}>
    <path d="M 420 -40 C 300 -20 200 -10 120 0" stroke={SLEEVE} strokeWidth={70} strokeLinecap="round" fill="none" />
    <ellipse cx={110} cy={0} rx={46} ry={36} fill={SKIN} stroke={INK} strokeWidth={7} />
    <rect x={-150} y={-10} width={250} height={18} rx={9} fill={STEEL} stroke={INK} strokeWidth={6} />
    <path d="M -230 -20 C -230 40 -150 40 -150 -20 Z" fill={STEEL} stroke={INK} strokeWidth={7} />
    <ellipse cx={-190} cy={-26} rx={44} ry={16} fill={WHITE} stroke={INK} strokeWidth={5} opacity={1 - tip} />
  </g>
);

export const Sack: React.FC<{x: number; y: number; label: string; tag: string; grain: string; s?: number; fade?: number}> = ({x, y, label, tag, grain, s = 1, fade = 1}) => {
  const r = rand(label.length);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={fade}>
      <path d="M -150 0 C -170 -120 -150 -260 -110 -320 L -60 -360 L 60 -360 L 110 -320 C 150 -260 170 -120 150 0 Z" fill="#C9A46A" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d="M -70 -360 C -40 -400 40 -400 70 -360" stroke={INK} strokeWidth={10} fill="#B8935A" />
      <rect x={-100} y={-230} width={200} height={90} rx={12} fill={CREAM} stroke={INK} strokeWidth={7} />
      <text x={0} y={-170} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={44} fill={INK}>{label}</text>
      {Array.from({length: 18}, (_, i) => (
        <ellipse key={i} cx={(r() - 0.5) * 300} cy={20 + r() * 30} rx={grain === 'rice' ? 10 : 12} ry={grain === 'rice' ? 4 : 7} fill={grain === 'rice' ? '#F6F4EC' : '#B88A4A'} stroke={INK} strokeWidth={2} />
      ))}
      <g transform="translate(0 -440)">
        <rect x={-90} y={-42} width={180} height={64} rx={32} fill={tag === 'NOW' ? RED : '#555'} stroke={INK} strokeWidth={6} />
        <text x={0} y={6} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={38} fill={WHITE}>{tag}</text>
      </g>
    </g>
  );
};

export const PlateauBG: React.FC = () => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
    <rect width={1080} height={1920} fill="#7FB3DA" />
    <path d="M -20 1050 L 180 900 L 330 990 L 520 870 L 720 1000 L 900 900 L 1100 1050 Z" fill="#B8A27F" />
    <path d="M 180 900 L 150 940 L 210 935 Z M 520 870 L 490 915 L 550 912 Z M 900 900 L 870 940 L 930 938 Z" fill={SNOW} />
    <rect y={1040} width={1080} height={880} fill="#CDB98F" />
    <ellipse cx={540} cy={1120} rx={420} ry={40} fill="#5C9BC9" opacity={0.85} />
    {/* yak silhouette (teaser only, no claim) */}
    <g transform="translate(600 1180)" fill="#2E2219">
      <path d="M -200 -40 C -200 -160 -60 -190 60 -170 C 160 -150 210 -100 210 -40 L 196 40 L -190 40 Z" />
      {[-170, -110, 120, 170].map((lx) => (
        <rect key={lx} x={lx - 14} y={20} width={28} height={110} rx={8} />
      ))}
      <path d="M -190 40 C -180 90 -120 80 -110 40 Z M 120 40 C 130 90 190 80 196 40 Z" />
      <ellipse cx={-230} cy={-60} rx={60} ry={50} />
      <path d="M -260 -100 C -300 -150 -280 -170 -250 -160 M -200 -100 C -170 -150 -190 -170 -215 -158" stroke="#2E2219" strokeWidth={16} fill="none" strokeLinecap="round" />
    </g>
  </svg>
);
