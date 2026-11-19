import React, {useContext} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile} from 'remotion';
import {EpCtx, EpProps, ShotCtx, Timing, makeWarp, useShotProgress} from './timing';
import {Captions, Cue, Fonts} from './ui/ui';
import {FPS} from './theme';

// Shared episode shell: shots and sounds are written in script seconds; a voice timing map (EpProps.timing)
// moves them onto the real voice. Used by every episode composition.

export type Sfx = {f: string; at: number; db: number; dur?: number; duck?: boolean};
export type Shot = [number, number, React.FC];

const dB = (x: number) => Math.pow(10, x / 20);

export const Sound: React.FC<{sfx: Sfx[]}> = ({sfx}) => {
  const {warp, timing} = useContext(EpCtx);
  const lines = timing?.lines ?? [];
  // Beds and ambience dip 7 dB under the voice, with 0.12 s ramps.
  const duck = (absFrame: number) => {
    const t = absFrame / FPS;
    let d = 0;
    for (const l of lines) {
      const k = Math.min(t - (l.start - 0.12), l.start + l.dur + 0.12 - t) / 0.12;
      d = Math.max(d, Math.min(1, Math.max(0, k)));
    }
    return dB(-7 * d);
  };
  const bedTrim = timing ? -3 : 0;
  return (
    <>
      {sfx.map((c, i) => {
        const from = Math.round(warp(c.at) * FPS);
        const dur = c.dur ? Math.max(1, Math.round(warp(c.at + c.dur) * FPS) - from) : undefined;
        const base = dB(c.db + (c.duck ? bedTrim : 0));
        const vol = c.duck && dur ? (f: number) => base * duck(from + f) * Math.min(1, (dur - f) / 12) : base;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Audio src={staticFile(`audio/${c.f}.wav`)} volume={vol} />
          </Sequence>
        );
      })}
      {lines.map((l) => (
        <Sequence key={`vo${l.i}`} from={Math.round(l.start * FPS)} layout="none">
          <Audio src={staticFile(l.file)} />
        </Sequence>
      ))}
      {(timing?.extra ?? []).map((e, i) => (
        <Sequence key={`x${i}`} from={Math.round(e.start * FPS)} layout="none">
          <Audio src={staticFile(e.file)} volume={dB(e.db)} />
        </Sequence>
      ))}
    </>
  );
};

// Captions follow the real voice: each line shows from its first word until the next line (max 0.6 s after it ends),
// never past the next shot cut.
export const voCues = (timing: Timing, cues: Cue[], cuts: number[]): Cue[] =>
  timing.lines.map((l, k) => {
    const next = timing.lines[k + 1];
    const end = l.start + l.dur;
    const cut = cuts.find((c) => c > end - 0.01) ?? Infinity;
    const to = Math.min(next ? next.start - 0.02 : Infinity, end + (next ? 0.6 : 0.8), cut - 0.03);
    return {from: Math.max(0, l.start - 0.05), to: Math.max(to, end), text: cues[l.i].text};
  });

// SVG <image> loads are not awaited by the renderer, so load the sprites once through <Img> (which is).
export const SpritePreload: React.FC = () => (
  <div style={{position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden'}}>
    <Img src={staticFile('seetu3d/body.png')} />
    <Img src={staticFile('seetu3d/lid.png')} />
  </div>
);

// Slow camera move over the whole shot (scale + pan of the scene layer, never the UI), so no shot ever freezes.
export const Cam: React.FC<{zoom?: [number, number]; pan?: [number, number]; origin?: [number, number]; children: React.ReactNode}> = ({
  zoom = [1, 1.06],
  pan = [0, 0],
  origin = [540, 1000],
  children,
}) => {
  const p = useShotProgress();
  const e = p * p * (3 - 2 * p) * 0.35 + p * 0.65; // gentle ease, never stops
  const s = zoom[0] + (zoom[1] - zoom[0]) * e;
  return (
    <AbsoluteFill style={{transform: `translate(${pan[0] * e}px, ${pan[1] * e}px) scale(${s})`, transformOrigin: `${origin[0]}px ${origin[1]}px`}}>
      {children}
    </AbsoluteFill>
  );
};

export const Episode: React.FC<{props: EpProps; cues: Cue[]; shots: Shot[]; sfx: Sfx[]; durationS: number}> = ({props, cues, shots, sfx, durationS}) => {
  const timing = props.timing ?? null;
  const sprites = props.sprites ?? false;
  const anchors = timing?.anchors ?? ([[0, 0], [durationS, durationS]] as [number, number][]);
  const {warp, inv} = makeWarp(anchors);
  const shown = timing ? voCues(timing, cues, shots.slice(1).map(([a]) => warp(a))) : cues;
  return (
    <EpCtx.Provider value={{warp, inv, mouth: timing?.mouth ?? [], sprites, timing}}>
      <AbsoluteFill style={{background: '#000'}}>
        <Fonts />
        {sprites && <SpritePreload />}
        {shots.map(([a, b, C], i) => {
          const from = Math.round(warp(a) * FPS);
          const to = Math.round(warp(b) * FPS);
          const durFrames = Math.max(1, to - from);
          return (
            <Sequence key={i} from={from} durationInFrames={durFrames}>
              <ShotCtx.Provider value={{scriptStart: a, startFrame: from, durFrames}}>
                <C />
              </ShotCtx.Provider>
            </Sequence>
          );
        })}
        <Captions cues={shown} />
        <Sound sfx={sfx} />
      </AbsoluteFill>
    </EpCtx.Provider>
  );
};
