import React from 'react';
import {Composition} from 'remotion';
import {Ep001, DURATION_S} from './Ep001';
import {Ep002, DURATION_S as EP002_S} from './ep002/Ep002';
import {EpProps} from './timing';
import {FPS, W, H} from './theme';

// Without props each episode renders its silent cut. With {timing, sprites} (see scripts/render.cjs) it renders the
// voiced 3D version, and the length follows the voice-over.
const len = (fallback: number) => ({props}: {props: Record<string, unknown>}) => ({
  durationInFrames: Math.round(((props as EpProps).timing?.total ?? fallback) * FPS),
});

export const Root: React.FC = () => (
  <>
    <Composition id="Ep001Leh" component={Ep001} durationInFrames={DURATION_S * FPS} fps={FPS} width={W} height={H} defaultProps={{timing: null, sprites: false} as EpProps} calculateMetadata={len(DURATION_S)} />
    <Composition id="Ep002Changthang" component={Ep002} durationInFrames={Math.round(EP002_S * FPS)} fps={FPS} width={W} height={H} defaultProps={{timing: null, sprites: false} as EpProps} calculateMetadata={len(EP002_S)} />
  </>
);
