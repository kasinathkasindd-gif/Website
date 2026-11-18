import React from 'react';
import {interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, RED, TURMERIC, WHITE, SHADE, FONT_HEAD, FONT_BODY} from '../theme';

export const Fonts: React.FC = () => (
  <style>{`
    @font-face { font-family: 'InterDisplayBlack'; src: url('${staticFile('fonts/InterDisplay-Black.otf')}') format('opentype'); font-weight: 900; }
    @font-face { font-family: 'InterXB'; src: url('${staticFile('fonts/Inter-ExtraBold.otf')}') format('opentype'); font-weight: 800; }
    @font-face { font-family: 'InterB'; src: url('${staticFile('fonts/Inter-Bold.otf')}') format('opentype'); font-weight: 700; }
  `}</style>
);

const pop = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 180, mass: 0.6}});

// ---------- Captions (burned-in, the VO stand-in for the silent animatic) ----------
export type Cue = {from: number; to: number; text: string};
export const Captions: React.FC<{cues: Cue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  const local = Math.round((t - cue.from) * fps);
  const s = pop(local, fps);
  const out = interpolate(t, [cue.to - 0.12, cue.to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 150,
        top: 1250,
        display: 'flex',
        justifyContent: 'center',
        opacity: out,
        transform: `translateY(${(1 - s) * 30}px) scale(${0.94 + 0.06 * s})`,
      }}
    >
      <div
        style={{
          background: 'rgba(20,20,20,0.82)',
          color: WHITE,
          fontFamily: FONT_BODY,
          fontSize: 54,
          lineHeight: 1.18,
          padding: '20px 30px',
          borderRadius: 26,
          textAlign: 'center',
          maxWidth: 860,
          boxShadow: '0 8px 0 rgba(0,0,0,0.25)',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};

// ---------- Hook text (top third, 0-2 s) ----------
export const HookText: React.FC<{pre?: string; key1: string; post?: string}> = ({pre = '', key1, post = ''}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, 2);
  return (
    <div style={{position: 'absolute', top: 210, left: 60, right: 150, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -6}deg)`,
          background: INK,
          color: WHITE,
          fontFamily: FONT_HEAD,
          fontSize: 118,
          lineHeight: 1,
          padding: '26px 40px 30px',
          borderRadius: 28,
          letterSpacing: -2,
          textAlign: 'center',
          boxShadow: `0 12px 0 ${RED}`,
        }}
      >
        {pre}
        <span style={{color: TURMERIC}}>{key1}</span>
        {post}
      </div>
    </div>
  );
};

// ---------- Meal chip + whistle counter (top-left) ----------
export const MealChip: React.FC<{label: string; emoji: string; whistles: number; litAt?: number}> = ({label, emoji, whistles, litAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps);
  return (
    <div style={{position: 'absolute', top: 120, left: 60, display: 'flex', alignItems: 'center', gap: 18, transform: `translateX(${(1 - s) * -260}px)`}}>
      <div style={{background: RED, color: WHITE, fontFamily: FONT_HEAD, fontSize: 46, padding: '10px 26px 12px', borderRadius: 999, border: `5px solid ${INK}`}}>
        {emoji} {label}
      </div>
      <div style={{display: 'flex', gap: 8}}>
        {[0, 1, 2].map((i) => {
          const lit = i < whistles - 1 || (i === whistles - 1 && litAt !== undefined && frame >= litAt) || (litAt === undefined && i < whistles);
          return (
            <div
              key={i}
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                border: `5px solid ${INK}`,
                background: lit ? RED : 'rgba(255,255,255,0.75)',
                transform: lit && litAt !== undefined && i === whistles - 1 ? `scale(${1 + 0.4 * Math.max(0, 1 - (frame - litAt) / 8)})` : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// ---------- Steam-o-meter (spice, top-right inside the safe zone) ----------
const Puff: React.FC<{on: boolean; x: number}> = ({on, x}) => (
  <path
    transform={`translate(${x} 0)`}
    d="M 6 44 C -6 44 -8 24 8 22 C 8 6 30 0 38 14 C 48 2 70 8 66 26 C 80 28 80 44 66 44 Z"
    fill={on ? WHITE : 'rgba(255,255,255,0.25)'}
    stroke={on ? INK : SHADE}
    strokeWidth={5}
  />
);
export const SteamMeter: React.FC<{level: number; appearAt?: number; scale?: number}> = ({level, appearAt = 0, scale = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, appearAt);
  const shown = Math.min(level, Math.max(0, Math.floor((frame - appearAt - 6) / 5)));
  return (
    <div style={{position: 'absolute', top: 116, right: 140, transform: `scale(${s * scale})`, transformOrigin: 'right top'}}>
      <div style={{background: 'rgba(20,20,20,0.78)', borderRadius: 22, padding: '10px 16px 6px', border: `4px solid ${INK}`}}>
        <div style={{fontFamily: FONT_BODY, fontSize: 24, color: TURMERIC, textAlign: 'center', letterSpacing: 2}}>SPICE</div>
        <svg width={250} height={56} viewBox="0 0 250 56">
          <Puff on={shown >= 1} x={0} />
          <Puff on={shown >= 2} x={86} />
          <Puff on={shown >= 3} x={172} />
        </svg>
      </div>
    </div>
  );
};

// ---------- Dish card (top area, three layers: script · roman · English) ----------
export const DishCard: React.FC<{name: string; meaning: string; script?: string; delay?: number}> = ({name, meaning, script, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', top: 230, left: 60, transform: `translateY(${(1 - s) * -40}px)`, opacity: s}}>
      <div style={{background: WHITE, border: `6px solid ${INK}`, borderRadius: 26, padding: '14px 26px 16px', boxShadow: `0 10px 0 ${TURMERIC}`, maxWidth: 820}}>
        {script && <div style={{fontFamily: FONT_BODY, fontSize: 34, color: '#555'}}>{script}</div>}
        <div style={{fontFamily: FONT_HEAD, fontSize: 64, color: INK, lineHeight: 1.05}}>{name}</div>
        <div style={{fontFamily: FONT_BODY, fontSize: 34, color: '#444'}}>{meaning}</div>
      </div>
    </div>
  );
};

// ---------- Fact card ----------
export const FactCard: React.FC<{text: string; source: string; delay?: number}> = ({text, source, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', top: 230, left: 70, right: 150, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${0.7 + 0.3 * s}) rotate(${(1 - s) * 4}deg)`, background: TURMERIC, border: `7px solid ${INK}`, borderRadius: 30, padding: '22px 30px', boxShadow: `0 12px 0 ${INK}`, textAlign: 'center'}}>
        <div style={{fontFamily: FONT_HEAD, fontSize: 64, lineHeight: 1.08, color: INK}}>{text}</div>
        <div style={{fontFamily: FONT_BODY, fontSize: 28, marginTop: 10, color: '#3a3a3a'}}>Source: {source}</div>
      </div>
    </div>
  );
};

// ---------- Location pin / counter badges ----------
export const Badge: React.FC<{text: string; top: number; delay?: number; bg?: string; color?: string; size?: number}> = ({text, top, delay = 0, bg = WHITE, color = INK, size = 50}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', top, left: 70, right: 150, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${s})`, background: bg, color, fontFamily: FONT_HEAD, fontSize: size, padding: '12px 30px 14px', borderRadius: 999, border: `6px solid ${INK}`, boxShadow: `0 8px 0 ${INK}`}}>
        {text}
      </div>
    </div>
  );
};

export const SpeechBubble: React.FC<{text: string; x: number; y: number; delay?: number; tail?: 'right' | 'left'}> = ({text, x, y, delay = 0, tail = 'right'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, transformOrigin: tail === 'right' ? 'right bottom' : 'left bottom'}}>
      <div style={{position: 'relative', background: WHITE, border: `6px solid ${INK}`, borderRadius: 40, padding: '16px 30px', fontFamily: FONT_HEAD, fontSize: 56, color: INK}}>
        {text}
        <div style={{position: 'absolute', bottom: -34, [tail === 'right' ? 'right' : 'left']: 40, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `34px solid ${INK}`}} />
      </div>
    </div>
  );
};
