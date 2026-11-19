import {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from './theme';

// Voice-driven timing.
// Every shot, cue and sound in Ep001.tsx is written in *script seconds*. When a real voice-over exists,
// scripts/build_timing.py measures each line and writes `timing.json`: a piecewise-linear map from
// script time to real time (anchors) plus where each VO line starts. Without it, real time = script time.

export type VoLine = {i: number; file: string; start: number; dur: number};
export type ExtraVo = {file: string; start: number; db: number};
export type Timing = {
  lines: VoLine[]; // real start (s) and length (s) of each VO line, i = CUES index
  extra?: ExtraVo[]; // other voices (the host's "Every day!")
  anchors: [number, number][]; // [script s, real s], increasing in both
  total: number; // real duration (s)
  mouth: number[]; // per real frame: 0 = not talking, otherwise 0.05 + 0.95 * loudness (0..1)
};
export type EpProps = {timing?: Timing | null; sprites?: boolean};

export const makeWarp = (anchors: [number, number][]) => {
  const map = (t: number, a: 0 | 1, b: 0 | 1) => {
    const n = anchors.length;
    if (n === 0) return t;
    if (t <= anchors[0][a]) return anchors[0][b] + (t - anchors[0][a]);
    for (let k = 1; k < n; k++) {
      if (t <= anchors[k][a]) {
        const p = anchors[k - 1];
        const q = anchors[k];
        const u = (t - p[a]) / (q[a] - p[a]);
        return p[b] + u * (q[b] - p[b]);
      }
    }
    return anchors[n - 1][b] + (t - anchors[n - 1][a]);
  };
  return {warp: (s: number) => map(s, 0, 1), inv: (r: number) => map(r, 1, 0)};
};

type Ep = {
  warp: (s: number) => number;
  inv: (r: number) => number;
  mouth: number[];
  sprites: boolean;
  timing: Timing | null;
};
export const EpCtx = createContext<Ep>({warp: (s) => s, inv: (r) => r, mouth: [], sprites: false, timing: null});
export const ShotCtx = createContext<{scriptStart: number; startFrame: number; durFrames?: number}>({scriptStart: 0, startFrame: 0});

// Shot-local frame counter in *script* frames, so every animation key in a shot stays valid when the voice
// stretches or squeezes time. Fractional values are fine for interpolate() and spring().
export const useShotFrame = () => {
  const f = useCurrentFrame();
  const {inv} = useContext(EpCtx);
  const {scriptStart, startFrame} = useContext(ShotCtx);
  return (inv((startFrame + f) / FPS) - scriptStart) * FPS;
};

// Absolute real frame, for lip-sync.
export const useAbsFrame = () => {
  const f = useCurrentFrame();
  const {startFrame} = useContext(ShotCtx);
  return startFrame + f;
};

// Convert a shot-local *script* frame (e.g. a UI element's delay) to the shot-local *real* frame.
export const useToReal = () => {
  const {warp} = useContext(EpCtx);
  const {scriptStart, startFrame} = useContext(ShotCtx);
  return (sf: number) => (sf >= 99999 ? sf : warp(scriptStart + sf / FPS) * FPS - startFrame);
};

// 0..1 through the current shot in real time (camera drift, ambient motion that must span the whole shot).
export const useShotProgress = () => {
  const f = useCurrentFrame();
  const {durFrames = 1} = useContext(ShotCtx);
  return Math.min(1, Math.max(0, f / Math.max(1, durFrames - 1)));
};
