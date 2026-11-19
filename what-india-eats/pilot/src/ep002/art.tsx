import React from 'react';
import {INK, WHITE, RED, TURMERIC, SNOW, COPPER, WOOD, WOOD_DARK, FONT_HEAD, FONT_BODY} from '../theme';
import {rand} from '../scenes/scenes';

// EP002 Changthang art: high plateau, herds, a herders' camp, tent interior, dairy and meat, Nubra dunes.
// Everything animates from `t` (seconds) so no shot is ever still.

export const pmod = (a: number, n: number) => ((a % n) + n) % n;
const FULL = {width: 1080, height: 1920, viewBox: '0 0 1080 1920', style: {position: 'absolute' as const}};
type TOD = 'dawn' | 'day' | 'night';
const PAL: Record<TOD, {sky0: string; sky1: string; far: string; near: string; snow: string; lake: string; ground: string; ground2: string}> = {
  dawn: {sky0: '#8DB8E2', sky1: '#F7D2A4', far: '#B49DBA', near: '#A9825E', snow: '#FFF4EA', lake: '#6FB6CF', ground: '#D9BC8A', ground2: '#C9A774'},
  day: {sky0: '#5FA6DE', sky1: '#CFE7F6', far: '#A897B8', near: '#A88460', snow: '#F6F9FC', lake: '#3FA9CC', ground: '#D3BE8C', ground2: '#C2AA77'},
  night: {sky0: '#0B1531', sky1: '#24375F', far: '#2F3A63', near: '#232C4C', snow: '#C9D3EA', lake: '#2B4A78', ground: '#2E3753', ground2: '#262E47'},
};

export const Stars: React.FC<{t: number; n?: number; maxY?: number}> = ({t, n = 70, maxY = 900}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const r = rand(i + 501);
      const x = r() * 1080;
      const y = r() * maxY;
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(t * (0.8 + r() * 1.6) + i));
      return <circle key={i} cx={x} cy={y} r={1.5 + r() * 3} fill={WHITE} opacity={tw} />;
    })}
  </g>
);

export const Snow: React.FC<{t: number; n?: number; speed?: number; top?: number; bottom?: number}> = ({t, n = 46, speed = 60, top = 0, bottom = 1920}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const r = rand(i + 901);
      const h = bottom - top;
      const y = top + pmod(r() * h + t * speed * (0.6 + r() * 0.8), h);
      const x = pmod(r() * 1080 + Math.sin(t * 0.9 + i) * 26 + t * 14, 1080);
      return <circle key={i} cx={x} cy={y} r={3 + r() * 5} fill={WHITE} opacity={0.75} />;
    })}
  </g>
);

const Cloud: React.FC<{x: number; y: number; s: number; o?: number}> = ({x, y, s, o = 0.9}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M -120 20 C -150 20 -150 -20 -115 -22 C -110 -60 -50 -66 -30 -36 C -10 -76 70 -70 72 -26 C 112 -30 126 20 90 20 Z" fill={WHITE} />
  </g>
);

const Grass: React.FC<{t: number; seed: number; top: number; n?: number; color: string}> = ({t, seed, top, n = 16, color}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const r = rand(seed + i);
      const x = r() * 1080;
      const y = top + r() * (1900 - top);
      const k = 0.6 + (y - top) / 1400;
      const sw = Math.sin(t * 2.2 + i * 1.7) * 7;
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${k}) rotate(${sw})`}>
          <path d="M 0 0 C -6 -20 -14 -34 -22 -40 M 0 0 C 0 -24 4 -40 8 -50 M 0 0 C 6 -18 16 -28 26 -32" stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

// Plateau with snowy ranges, a lake and drifting clouds. horizon = y of the lake line.
export const ChangthangBG: React.FC<{t: number; tod?: TOD; horizon?: number; lake?: boolean}> = ({t, tod = 'day', horizon = 980, lake = true}) => {
  const P = PAL[tod];
  const H = horizon;
  const id = `cbg-${tod}`;
  const peaks: [number, number][] = [[150, H - 215], [380, H - 255], [610, H - 265], [860, H - 235], [1040, H - 200]];
  return (
    <svg {...FULL}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.sky0} />
          <stop offset="1" stopColor={P.sky1} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={`url(#${id})`} />
      {tod === 'night' ? (
        <g>
          <Stars t={t} maxY={H - 200} />
          <circle cx={830} cy={330} r={62} fill="#F4EFD8" />
          <circle cx={852} cy={318} r={56} fill={P.sky0} opacity={0.0} />
        </g>
      ) : (
        <g>
          <circle cx={tod === 'dawn' ? 760 : 860} cy={tod === 'dawn' ? H - 330 : 300} r={tod === 'dawn' ? 70 : 56} fill={tod === 'dawn' ? '#FFE3A8' : '#FFF6D8'} opacity={0.95} />
          {[0, 1, 2].map((i) => (
            <Cloud key={i} x={pmod(i * 420 + t * (14 + i * 6), 1500) - 210} y={220 + i * 120} s={0.9 + i * 0.25} o={tod === 'dawn' ? 0.75 : 0.9} />
          ))}
        </g>
      )}
      <path d={`M -20 ${H} L 60 ${H - 150} L 150 ${H - 215} L 260 ${H - 140} L 380 ${H - 255} L 500 ${H - 170} L 610 ${H - 265} L 740 ${H - 160} L 860 ${H - 235} L 960 ${H - 150} L 1040 ${H - 200} L 1100 ${H - 160} L 1100 ${H} Z`} fill={P.far} />
      {peaks.map(([px, py], i) => (
        <path key={i} d={`M ${px - 46} ${py + 56} L ${px} ${py} L ${px + 46} ${py + 56} L ${px + 22} ${py + 44} L ${px + 4} ${py + 62} L ${px - 18} ${py + 46} Z`} fill={P.snow} />
      ))}
      <path d={`M -20 ${H + 40} L 120 ${H - 60} L 250 ${H + 6} L 400 ${H - 92} L 560 ${H + 16} L 700 ${H - 74} L 860 ${H + 12} L 1000 ${H - 52} L 1100 ${H + 8} L 1100 ${H + 70} L -20 ${H + 70} Z`} fill={P.near} />
      {lake && (
        <g>
          <path d={`M -20 ${H + 52} C 300 ${H + 34} 760 ${H + 34} 1100 ${H + 52} L 1100 ${H + 120} C 760 ${H + 134} 300 ${H + 134} -20 ${H + 120} Z`} fill={P.lake} />
          {[0, 1, 2, 3].map((i) => {
            const sx = pmod(i * 290 + t * 22, 1200) - 80;
            return <path key={i} d={`M ${sx} ${H + 72 + (i % 2) * 26} l 90 0`} stroke={WHITE} strokeWidth={5} strokeLinecap="round" opacity={0.55} />;
          })}
        </g>
      )}
      <rect y={H + (lake ? 110 : 60)} width={1080} height={1920} fill={P.ground} />
      <path d={`M -20 ${H + 330} C 260 ${H + 290} 640 ${H + 360} 1100 ${H + 300} L 1100 1920 L -20 1920 Z`} fill={P.ground2} opacity={0.55} />
      <Grass t={t} seed={77} top={H + 160} color={tod === 'night' ? '#3E4A6B' : '#9C8A5C'} />
    </svg>
  );
};

// Five-colour flags strung between two poles, fluttering.
export const PrayerFlags: React.FC<{x1: number; y1: number; x2: number; y2: number; t: number; n?: number}> = ({x1, y1, x2, y2, t, n = 9}) => {
  const C = ['#2E6FD8', '#F4F4F4', '#D9342B', '#2E9E4F', '#F2C230'];
  const sag = 60;
  const pt = (u: number) => [x1 + (x2 - x1) * u, y1 + (y2 - y1) * u + Math.sin(u * Math.PI) * sag] as const;
  return (
    <g>
      <path d={`M ${x1} ${y1 - 10} L ${x1} ${y1 + 240} M ${x2} ${y2 - 10} L ${x2} ${y2 + 240}`} stroke={WOOD_DARK} strokeWidth={10} strokeLinecap="round" />
      <path d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag * 2} ${x2} ${y2}`} stroke={INK} strokeWidth={3} fill="none" />
      {Array.from({length: n}, (_, i) => {
        const u = (i + 0.7) / (n + 0.4);
        const [fx, fy] = pt(u);
        const w = Math.sin(t * 4.2 + i * 0.9) * 14;
        return (
          <path
            key={i}
            d={`M ${fx - 16} ${fy} L ${fx + 16} ${fy} L ${fx + 16 + w * 0.4} ${fy + 44} L ${fx - 16 + w * 0.4} ${fy + 44} Z`}
            fill={C[i % 5]}
            stroke={INK}
            strokeWidth={3}
          />
        );
      })}
    </g>
  );
};

// A herders' black tent with a smoke vent; `glow` lights the doorway (night).
export const Tent: React.FC<{x: number; y: number; s?: number; t: number; glow?: boolean}> = ({x, y, s = 1, t, glow = false}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -300 0 L -360 30 M 300 0 L 360 30 M -150 -150 L -330 20 M 150 -150 L 330 20" stroke="#4A3B30" strokeWidth={5} />
    <path d="M -290 0 L -210 -150 L 0 -196 L 210 -150 L 290 0 Z" fill="#2A221D" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M -240 -90 L 240 -90 M -270 -40 L 270 -40" stroke="#3B312A" strokeWidth={8} />
    <path d="M -56 0 L -44 -118 L 44 -118 L 56 0 Z" fill={glow ? '#FFB347' : '#120D0A'} stroke={INK} strokeWidth={6} />
    {glow && <ellipse cx={0} cy={10} rx={150} ry={22} fill="#FFB347" opacity={0.25} />}
    {[0, 1, 2].map((i) => {
      const p = pmod(t * 0.35 + i / 3, 1);
      return (
        <circle key={i} cx={-6 + Math.sin(p * 5 + i) * 16 + p * 30} cy={-200 - p * 190} r={14 + p * 26} fill={glow ? '#7D7F8F' : '#D7D2CC'} opacity={(1 - p) * 0.6} />
      );
    })}
  </g>
);

// Big shaggy yak, side view facing left (flip to face right). Chews, swishes its tail, blinks, walks.
export const Yak: React.FC<{x: number; y: number; s?: number; t: number; walk?: boolean; flip?: boolean; breath?: boolean}> = ({x, y, s = 1, t, walk = false, flip = false, breath = false}) => {
  const ph = t * 7;
  const leg = (o: number) => (walk ? Math.sin(ph + o) * 14 : 0);
  const bob = walk ? Math.abs(Math.sin(ph)) * -8 : Math.sin(t * 1.6) * 2;
  const chew = Math.max(0, Math.sin(t * 6)) * 7;
  const tail = Math.sin(t * 2.4) * 14;
  const ear = Math.sin(t * 0.9) > 0.92 ? 18 : 0;
  const blink = pmod(t * 30, 110) < 4;
  const puff = pmod(t, 2.2) / 2.2;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {[[-150, 0], [-105, Math.PI], [135, Math.PI], [178, 0]].map(([lx, o], i) => (
        <g key={i} transform={`rotate(${leg(o)} ${lx} -120)`}>
          <rect x={lx - 20} y={-130} width={40} height={128} rx={14} fill={i % 3 === 0 ? '#2A1D16' : '#3B2A20'} stroke={INK} strokeWidth={7} />
          <rect x={lx - 22} y={-16} width={44} height={18} rx={6} fill="#1A1210" stroke={INK} strokeWidth={6} />
        </g>
      ))}
      <g transform={`translate(0 ${bob})`}>
        <g transform={`rotate(${tail} 222 -186)`}>
          <path d="M 222 -186 C 262 -160 268 -100 250 -48 C 240 -40 226 -44 224 -60 C 230 -100 226 -140 210 -176 Z" fill="#2A1D16" stroke={INK} strokeWidth={7} />
        </g>
        <path d="M -200 -120 C -236 -230 -150 -300 -40 -292 C 70 -300 200 -280 236 -180 C 248 -140 236 -112 214 -104 L -180 -100 Z" fill="#3B2A20" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        <path d="M -120 -282 C -60 -310 20 -300 60 -290" stroke="#5A4232" strokeWidth={10} fill="none" strokeLinecap="round" />
        <path
          d="M -206 -118 L -186 -64 L -166 -112 L -146 -56 L -124 -110 L -102 -60 L -80 -108 L -58 -58 L -36 -106 L -12 -62 L 10 -106 L 34 -60 L 56 -106 L 80 -62 L 102 -104 L 126 -60 L 148 -104 L 172 -64 L 192 -102 L 214 -70 L 226 -110"
          fill="#2A1D16"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {breath && puff < 0.6 && (
          <g opacity={(0.6 - puff) * 1.4}>
            <circle cx={-330 - puff * 120} cy={-150 - puff * 30} r={18 + puff * 40} fill={WHITE} />
          </g>
        )}
        <g transform="translate(-210 -190)">
          <g transform={`rotate(${-ear} 30 -40)`}>
            <path d="M 30 -40 C 70 -54 90 -40 84 -26 C 66 -24 46 -26 30 -30 Z" fill="#3B2A20" stroke={INK} strokeWidth={6} />
          </g>
          <path d="M -40 -50 C -70 -96 -40 -140 -16 -150 C -20 -126 -30 -96 -6 -64 Z" fill="#EDE3CC" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          <path d="M 34 -54 C 70 -100 50 -140 26 -152 C 34 -126 40 -98 18 -64 Z" fill="#EDE3CC" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          <path d="M -60 -60 C -40 -80 30 -84 50 -60 C 64 -20 40 40 0 60 C -50 66 -96 50 -110 20 C -112 -16 -86 -46 -60 -60 Z" fill="#3B2A20" stroke={INK} strokeWidth={8} />
          <path d="M -40 -50 C -20 -64 8 -60 14 -44 C 4 -30 -24 -30 -40 -50 Z" fill="#F2EAD8" />
          <path d={`M -112 18 C -100 ${50 + chew} -40 ${66 + chew} 2 ${54 + chew}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
          <ellipse cx={-92} cy={14} rx={30} ry={26} fill="#5B4436" stroke={INK} strokeWidth={6} />
          <ellipse cx={-102} cy={10} rx={5} ry={4} fill={INK} />
          {blink ? (
            <path d="M -36 -10 Q -24 -2 -12 -10" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
          ) : (
            <g>
              <ellipse cx={-24} cy={-12} rx={14} ry={16} fill={WHITE} stroke={INK} strokeWidth={5} />
              <circle cx={-28} cy={-10} r={8} fill={INK} />
              <circle cx={-25} cy={-14} r={3} fill={WHITE} />
            </g>
          )}
        </g>
      </g>
    </g>
  );
};

// Fluffy pashmina goat (or a sheep), side view facing left; grazing head-dip.
export const Goat: React.FC<{x: number; y: number; s?: number; t: number; sheep?: boolean; flip?: boolean; phase?: number; walk?: boolean; longHorns?: boolean}> = ({x, y, s = 1, t, sheep = false, flip = false, phase = 0, walk = false, longHorns = false}) => {
  const graze = (Math.sin(t * 1.3 + phase) + 1) / 2;
  const head = walk ? 0 : graze * 32;
  const leg = (o: number) => (walk ? Math.sin(t * 8 + o) * 16 : 0);
  const wool = sheep ? '#EFE7D6' : '#F7F3EA';
  const face = sheep ? '#2E2724' : '#F7F3EA';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {[[-60, 0], [-36, Math.PI], [52, Math.PI], [76, 0]].map(([lx, o], i) => (
        <g key={i} transform={`rotate(${leg(o)} ${lx} -60)`}>
          <rect x={lx - 9} y={-66} width={18} height={66} rx={7} fill={sheep ? '#2E2724' : '#3A2E26'} stroke={INK} strokeWidth={5} />
        </g>
      ))}
      <path
        d="M -96 -70 C -120 -80 -110 -120 -84 -122 C -80 -150 -40 -156 -24 -136 C -10 -160 34 -160 46 -136 C 66 -152 104 -140 102 -112 C 128 -106 126 -66 100 -60 C 96 -40 64 -36 50 -50 C 34 -34 -4 -36 -12 -50 C -34 -34 -74 -40 -76 -58 C -90 -54 -100 -60 -96 -70 Z"
        fill={wool}
        stroke={INK}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      <g transform={`rotate(${-head} -96 -104)`}>
        {!sheep && !longHorns && <path d="M -112 -150 C -96 -186 -64 -184 -58 -164 C -74 -172 -92 -164 -100 -142 Z" fill="#B8A27F" stroke={INK} strokeWidth={5} />}
        {!sheep && longHorns && (
          <g fill="#C8B48C" stroke={INK} strokeWidth={5} strokeLinejoin="round">
            <path d="M -110 -146 C -104 -200 -60 -236 -20 -238 C -46 -224 -70 -196 -92 -140 Z" />
            <path d="M -96 -150 C -80 -196 -40 -222 -6 -216 C -34 -206 -56 -186 -80 -144 Z" />
          </g>
        )}
        <path d="M -98 -132 C -150 -136 -166 -100 -150 -84 C -136 -72 -110 -80 -94 -96 Z" fill={face} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M -96 -128 C -86 -146 -70 -146 -62 -136" stroke={INK} strokeWidth={5} fill="none" />
        <ellipse cx={-90} cy={-124} rx={20} ry={9} transform="rotate(25 -90 -124)" fill={face} stroke={INK} strokeWidth={5} />
        <circle cx={-128} cy={-112} r={5} fill={sheep ? WHITE : INK} />
        {!sheep && <path d="M -148 -86 C -150 -70 -144 -60 -136 -56" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />}
        {!sheep && longHorns && <path d="M -146 -90 C -150 -56 -142 -40 -130 -34 C -132 -52 -134 -70 -132 -88 Z" fill="#E9E1D0" stroke={INK} strokeWidth={4} />}
      </g>
    </g>
  );
};

// Wooden bowl: a mound of tsampa (roasted barley flour) that turns into a tea-soaked dough as `mix` goes 0 → 1.
export const TsampaBowl: React.FC<{x: number; y: number; mix: number; t: number; stir?: boolean}> = ({x, y, mix, t, stir = false}) => {
  const a = t * 5;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -170 -80 C -160 4 -100 30 0 30 C 100 30 160 4 170 -80 Z" fill={WOOD} stroke={INK} strokeWidth={10} />
      <path d="M -150 -30 C -100 -6 100 -6 150 -30" stroke={WOOD_DARK} strokeWidth={8} fill="none" />
      <ellipse cx={0} cy={-80} rx={170} ry={34} fill="#C8A57A" stroke={INK} strokeWidth={9} />
      {mix > 0 && <ellipse cx={0} cy={-80} rx={150 * Math.min(1, mix * 1.4)} ry={26 * Math.min(1, mix * 1.4)} fill="#C79A64" />}
      <path d={`M -110 -86 C -70 ${-150 + mix * 40} 70 ${-150 + mix * 40} 110 -86 Z`} fill={mix < 0.6 ? '#EAD9B2' : '#D7B585'} stroke={INK} strokeWidth={7} />
      {Array.from({length: 9}, (_, i) => {
        const r = rand(i + 61);
        return <circle key={i} cx={-70 + r() * 140} cy={-100 - r() * 30 + mix * 20} r={3} fill="#B9925E" opacity={1 - mix} />;
      })}
      {stir && (
        <g transform={`translate(${Math.cos(a) * 40} ${Math.sin(a) * 8 - 96}) rotate(${-24 + Math.cos(a) * 8})`}>
          <rect x={-8} y={-190} width={16} height={190} rx={8} fill="#B07A45" stroke={INK} strokeWidth={6} />
          <ellipse cx={0} cy={0} rx={22} ry={12} fill="#B07A45" stroke={INK} strokeWidth={6} />
        </g>
      )}
    </g>
  );
};

// Iron pot of stew on a three-stone fire: flames flicker, the stew bubbles.
export const StewPot: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 1, 2].map((i) => {
      const f = Math.sin(t * 9 + i * 2) * 0.12 + 1;
      return (
        <path
          key={i}
          d={`M ${-60 + i * 60} 20 C ${-90 + i * 60} ${-30 * f} ${-50 + i * 60} ${-60 * f} ${-60 + i * 60} ${-110 * f} C ${-20 + i * 60} ${-60 * f} ${-30 + i * 60} ${-20 * f} ${-60 + i * 60} 20 Z`}
          fill={i === 1 ? '#FFB020' : '#F06A1C'}
          stroke={INK}
          strokeWidth={5}
        />
      );
    })}
    {[-150, 0, 150].map((sx) => (
      <ellipse key={sx} cx={sx} cy={20} rx={56} ry={34} fill="#8C8C8C" stroke={INK} strokeWidth={7} />
    ))}
    <path d="M -170 -110 C -170 -20 -120 10 0 10 C 120 10 170 -20 170 -110 Z" fill="#2A2B30" stroke={INK} strokeWidth={10} />
    <path d="M -186 -110 L 186 -110" stroke={INK} strokeWidth={14} strokeLinecap="round" />
    <path d="M -186 -110 C -230 -120 -230 -70 -186 -76 M 186 -110 C 230 -120 230 -70 186 -76" stroke={INK} strokeWidth={10} fill="none" />
    <ellipse cx={0} cy={-112} rx={168} ry={28} fill="#8B4A2B" stroke={INK} strokeWidth={6} />
    {[[-80, -114], [10, -120], [86, -110], [-30, -104]].map(([mx, my], i) => (
      <rect key={i} x={mx - 22} y={my - 12} width={44} height={26} rx={10} fill="#5E2E19" stroke={INK} strokeWidth={4} />
    ))}
    {Array.from({length: 6}, (_, i) => {
      const p = pmod(t * 1.6 + i / 6, 1);
      const r = rand(i + 333);
      return <circle key={i} cx={-120 + r() * 240} cy={-112 - p * 10} r={4 + p * 12} fill="none" stroke="#C47A50" strokeWidth={4} opacity={1 - p} />;
    })}
  </g>
);

// Plate of churpe (dried cheese) cubes.
export const ChurpePlate: React.FC<{x: number; y: number; n?: number}> = ({x, y, n = 7}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={190} ry={44} fill="#C9CED6" stroke={INK} strokeWidth={9} />
    <ellipse cx={0} cy={-6} rx={150} ry={30} fill="#DDE2E8" />
    {Array.from({length: n}, (_, i) => {
      const cx = -110 + (i % 4) * 70 + (i >= 4 ? 34 : 0);
      const cy = -26 - (i >= 4 ? 34 : 0);
      return <Cube key={i} x={cx} y={cy} s={1} />;
    })}
  </g>
);

export const Cube: React.FC<{x: number; y: number; s?: number; soft?: number}> = ({x, y, s = 1, soft = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s} ${s * (1 - soft * 0.25)})`}>
    <path d="M -26 -10 L 0 -24 L 26 -10 L 0 4 Z" fill="#FBF5E4" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -26 -10 L 0 4 L 0 34 L -26 20 Z" fill="#EADDBA" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 26 -10 L 0 4 L 0 34 L 26 20 Z" fill="#D9C79C" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

// Bowl of butter tea; `dunk` 0..1 drops a cube in (splash + ripples).
export const TeaBowl: React.FC<{x: number; y: number; t: number; dunk: number}> = ({x, y, t, dunk}) => {
  const fall = Math.min(1, dunk / 0.45);
  const after = Math.max(0, (dunk - 0.45) / 0.55);
  return (
    <g transform={`translate(${x} ${y})`}>
      {dunk > 0 && dunk < 0.45 && <Cube x={0} y={-330 + fall * 240} s={1.1} />}
      <path d="M -150 -70 C -140 10 -90 34 0 34 C 90 34 140 10 150 -70 Z" fill="#F4F1EA" stroke={INK} strokeWidth={9} />
      <path d="M -142 -40 C -90 -16 90 -16 142 -40" stroke="#2E6FD8" strokeWidth={10} fill="none" />
      <ellipse cx={0} cy={-70} rx={150} ry={30} fill="#D8BE93" stroke={INK} strokeWidth={8} />
      {after > 0 && (
        <g>
          {[0, 1, 2].map((i) => {
            const k = (after * 1.4 + i * 0.25) % 1;
            return <ellipse key={i} cx={0} cy={-70} rx={30 + k * 110} ry={6 + k * 20} fill="none" stroke="#F4E7C9" strokeWidth={5} opacity={1 - k} />;
          })}
          {after < 0.4 &&
            [-1, 1].map((d) => <circle key={d} cx={d * (20 + after * 120)} cy={-90 - Math.sin(after * Math.PI / 0.4) * 60} r={10} fill="#E6D2AA" stroke={INK} strokeWidth={4} />)}
          <Cube x={6} y={-66} s={0.8} soft={Math.min(1, after * 1.5)} />
        </g>
      )}
      {[0, 1].map((i) => {
        const p = pmod(t * 0.5 + i / 2, 1);
        return <path key={i} d={`M ${-30 + i * 60} ${-100 - p * 120} c -18 -20 18 -30 0 -54`} stroke={WHITE} strokeWidth={10} fill="none" strokeLinecap="round" opacity={Math.sin(p * Math.PI) * 0.8} />;
      })}
    </g>
  );
};

// Cosy tent interior at night: woven walls, centre pole, stove with flickering fire, lantern, rug, low table.
export const TentInteriorBG: React.FC<{t: number}> = ({t}) => {
  const fl = 0.75 + Math.sin(t * 11) * 0.1 + Math.sin(t * 17) * 0.08;
  return (
    <svg {...FULL}>
      <defs>
        <radialGradient id="ep2-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD58A" stopOpacity={0.75} />
          <stop offset="1" stopColor="#FFD58A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="#3A2A21" />
      {Array.from({length: 12}, (_, i) => (
        <path key={i} d={`M 0 ${140 + i * 92} L 1080 ${110 + i * 92}`} stroke="#47352A" strokeWidth={26} />
      ))}
      <path d="M 0 0 L 540 -40 L 1080 0 L 1080 160 L 540 60 L 0 160 Z" fill="#2B201A" />
      <g>
        <path d="M 760 140 L 1040 230 L 1040 640 L 780 560 Z" fill="#0F1A36" stroke={INK} strokeWidth={10} />
        <g transform="translate(0 0)">
          {Array.from({length: 14}, (_, i) => {
            const r = rand(i + 71);
            const px = 790 + r() * 230;
            const py = 230 + r() * 300;
            return <circle key={i} cx={px} cy={py} r={2 + r() * 3} fill={WHITE} opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i))} />;
          })}
        </g>
      </g>
      <rect x={520} y={0} width={40} height={1200} fill="#7A5232" stroke={INK} strokeWidth={8} />
      <circle cx={360} cy={470} r={260} fill="url(#ep2-lamp)" opacity={fl} />
      <path d="M 360 300 L 360 400" stroke={INK} strokeWidth={6} />
      <path d="M 330 400 L 390 400 L 400 470 L 320 470 Z" fill={COPPER} stroke={INK} strokeWidth={7} />
      <ellipse cx={360} cy={440} rx={16} ry={22} fill="#FFE29A" opacity={fl} />
      <g transform="translate(985 1010)">
        <rect x={-110} y={-200} width={220} height={200} rx={18} fill="#26272B" stroke={INK} strokeWidth={10} />
        <rect x={-60} y={-140} width={120} height={80} rx={12} fill="#F06A1C" opacity={fl} stroke={INK} strokeWidth={7} />
        <rect x={-30} y={-760} width={60} height={560} fill="#3A3B40" stroke={INK} strokeWidth={8} />
      </g>
      <rect y={1150} width={1080} height={770} fill="#5A3B2A" />
      <path d="M 0 1220 L 1080 1200 L 1080 1920 L 0 1920 Z" fill="#9E2B25" />
      {Array.from({length: 6}, (_, i) => (
        <path key={i} d={`M 0 ${1300 + i * 100} L 1080 ${1280 + i * 100}`} stroke="#C9A84A" strokeWidth={8} strokeDasharray="30 22" opacity={0.7} />
      ))}
      <rect x={120} y={1120} width={840} height={46} rx={14} fill={WOOD} stroke={INK} strokeWidth={9} />
    </svg>
  );
};

// Golden dunes for the Nubra teaser, with drifting sand.
export const DunesBG: React.FC<{t: number}> = ({t}) => (
  <svg {...FULL}>
    <defs>
      <linearGradient id="ep2-dune-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7DB5E3" />
        <stop offset="1" stopColor="#F6DCB0" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#ep2-dune-sky)" />
    <path d="M -20 900 L 120 760 L 260 840 L 420 700 L 600 830 L 760 720 L 920 820 L 1100 760 L 1100 960 L -20 960 Z" fill="#A88B9E" />
    <path d="M -20 1000 C 200 880 360 900 560 980 C 760 1060 900 960 1100 920 L 1100 1920 L -20 1920 Z" fill="#E9B866" />
    <path d="M -20 1180 C 240 1060 480 1080 700 1160 C 860 1220 960 1180 1100 1120 L 1100 1920 L -20 1920 Z" fill="#E0A651" />
    <path d="M 560 980 C 760 1060 900 960 1100 920" stroke="#F7D592" strokeWidth={8} fill="none" />
    {Array.from({length: 7}, (_, i) => (
      <path key={i} d={`M ${-40 + i * 180} ${1300 + (i % 2) * 40} q 60 -18 120 0`} stroke="#C98E3E" strokeWidth={6} fill="none" opacity={0.7} />
    ))}
    {Array.from({length: 24}, (_, i) => {
      const r = rand(i + 401);
      const x = pmod(r() * 1080 + t * (120 + r() * 80), 1080);
      return <circle key={i} cx={x} cy={950 + r() * 500} r={2 + r() * 2} fill="#FFF0C8" opacity={0.7} />;
    })}
  </svg>
);

// Two-humped camel, side view facing left, walking.
export const Camel: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => {
  const ph = t * 5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[[-90, 0], [-60, Math.PI], [70, Math.PI], [100, 0]].map(([lx, o], i) => (
        <g key={i} transform={`rotate(${Math.sin(ph + o) * 14} ${lx} -150)`}>
          <rect x={lx - 13} y={-160} width={26} height={160} rx={10} fill={i % 3 ? '#B58A5A' : '#9E7448'} stroke={INK} strokeWidth={6} />
        </g>
      ))}
      <g transform={`translate(0 ${Math.abs(Math.sin(ph)) * -6})`}>
        <path d="M -130 -150 C -140 -210 -100 -230 -70 -220 C -60 -290 -10 -290 0 -226 C 20 -300 80 -300 90 -220 C 130 -220 150 -190 140 -150 Z" fill="#C49866" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M -130 -186 C -170 -220 -190 -300 -210 -330 L -250 -330 C -270 -320 -270 -300 -250 -296 L -222 -296 C -210 -260 -190 -200 -150 -150 Z" fill="#C49866" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <circle cx={-232} cy={-318} r={5} fill={INK} />
      </g>
    </g>
  );
};

// Count diagram: 1 yak = 3–4 sheep or goats, per family, per winter.
export const YakEquation: React.FC<{f: number; t: number}> = ({f, t}) => {
  const pop = (start: number) => Math.min(1, Math.max(0, (f - start) / 8));
  const ease = (v: number) => 1 - Math.pow(1 - v, 3);
  const yIn = ease(pop(18));
  return (
    <g>
      <g transform={`translate(${-500 + 760 * yIn} 0)`}>
        <Yak x={0} y={1110} s={0.62} t={t} flip />
        <text x={0} y={1180} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={64} fill={INK}>1 yak</text>
      </g>
      <g transform={`translate(540 940) scale(${ease(pop(44))})`}>
        <rect x={-46} y={-30} width={92} height={22} rx={10} fill={INK} />
        <rect x={-46} y={8} width={92} height={22} rx={10} fill={INK} />
      </g>
      {[0, 1, 2, 3].map((i) => {
        const k = ease(pop(58 + i * 12));
        const gx = 700 + (i % 2) * 170;
        const gy = 900 + Math.floor(i / 2) * 170;
        return (
          <g key={i} transform={`translate(${gx} ${gy}) scale(${k})`} opacity={i === 3 ? 0.45 : 1}>
            <Goat x={40} y={60} s={0.55} t={t} sheep={i % 2 === 1} phase={i} flip />
          </g>
        );
      })}
      <g opacity={pop(108)}>
        <text x={785} y={1200} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={60} fill={INK}>3–4 sheep or goats</text>
      </g>
    </g>
  );
};

// Wool tufts lift off the goat and weave into a shawl (0..1).
export const WoolToShawl: React.FC<{p: number; t: number; from: [number, number]; to: [number, number]}> = ({p, t, from, to}) => (
  <g>
    {p < 0.75 &&
      Array.from({length: 8}, (_, i) => {
        const k = Math.min(1, Math.max(0, p / 0.75 - i * 0.06));
        const x = from[0] + (to[0] - from[0]) * k + Math.sin(t * 3 + i) * 30 * (1 - k);
        const y = from[1] + (to[1] - from[1]) * k - Math.sin(k * Math.PI) * 220;
        return <Cloud key={i} x={x} y={y} s={0.28} o={k > 0 && k < 1 ? 1 : 0} />;
      })}
  </g>
);

// Shawl draped over Seetu's body (draw after Seetu, same anchor/scale).
export const ShawlOnSeetu: React.FC<{x: number; y: number; s: number; p: number; t: number}> = ({x, y, s, p, t}) => {
  if (p <= 0) return null;
  const k = Math.min(1, p);
  const sway = Math.sin(t * 3) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(-500 -905)`} opacity={k}>
      <g transform={`translate(0 ${(1 - k) * -300})`}>
        <path d={`M 270 560 C 400 610 600 610 730 560 L 750 640 C 600 700 400 700 250 640 Z`} fill="#F3E3C3" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        <path d="M 262 590 C 400 640 600 640 740 590" stroke={RED} strokeWidth={8} fill="none" />
        <path d="M 256 616 C 400 666 600 666 744 616" stroke={TURMERIC} strokeWidth={8} fill="none" />
        <path d={`M 690 610 C 720 690 ${730 + sway} 760 ${720 + sway} 820 L ${680 + sway} 820 C ${690 + sway} 760 670 690 650 620 Z`} fill="#F3E3C3" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${684 + sway + i * 11} 820 l 0 22`} stroke={INK} strokeWidth={4} />
        ))}
      </g>
    </g>
  );
};

// Comic "CLONK!" burst with orbiting stars.
export const Clonk: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => {
  if (f < 0 || f > 40) return null;
  const k = Math.min(1, f / 5);
  const fade = f > 30 ? 1 - (f - 30) / 10 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`} opacity={fade}>
      <path d="M -170 0 L -120 -50 L -140 -120 L -60 -90 L -20 -160 L 20 -96 L 100 -130 L 90 -60 L 170 -30 L 100 10 L 130 80 L 50 60 L 0 130 L -40 60 L -120 90 L -100 30 Z" fill={TURMERIC} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <text x={0} y={22} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={70} fill={RED} stroke={INK} strokeWidth={3}>CLONK!</text>
    </g>
  );
};

export const DizzyStars: React.FC<{x: number; y: number; f: number; r?: number}> = ({x, y, f, r = 120}) => {
  if (f < 0 || f > 60) return null;
  return (
    <g opacity={f > 48 ? 1 - (f - 48) / 12 : 1}>
      {[0, 1, 2].map((i) => {
        const a = f * 0.25 + (i * Math.PI * 2) / 3;
        const sx = x + Math.cos(a) * r;
        const sy = y + Math.sin(a) * r * 0.35;
        return (
          <path
            key={i}
            d={`M ${sx} ${sy - 26} L ${sx + 8} ${sy - 8} L ${sx + 26} ${sy - 6} L ${sx + 12} ${sy + 6} L ${sx + 16} ${sy + 24} L ${sx} ${sy + 14} L ${sx - 16} ${sy + 24} L ${sx - 12} ${sy + 6} L ${sx - 26} ${sy - 6} L ${sx - 8} ${sy - 8} Z`}
            fill={TURMERIC}
            stroke={INK}
            strokeWidth={4}
          />
        );
      })}
    </g>
  );
};

export const WinterTag: React.FC<{opacity: number}> = ({opacity}) => (
  <g opacity={opacity}>
    <rect x={190} y={650} width={700} height={92} rx={46} fill={WHITE} stroke={INK} strokeWidth={7} />
    <text x={540} y={712} textAnchor="middle" fontFamily={FONT_BODY} fontSize={44} fill={INK}>❄ per family · per winter ❄</text>
  </g>
);

export {SNOW};
