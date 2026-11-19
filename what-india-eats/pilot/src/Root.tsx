import React from 'react';
import {Composition} from 'remotion';
import {Ep001, DURATION_S} from './Ep001';
import {EpProps} from './timing';
import {FPS, W, H} from './theme';

// Without props this renders the silent animatic. With {timing, sprites} (see scripts/render.cjs) it renders the
// voiced 3D version, and the length follows the voice-over.
export const Root: React.FC = () => (
  <Composition
    id="Ep001Leh"
    component={Ep001}
    durationInFrames={DURATION_S * FPS}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{timing: null, sprites: false} as EpProps}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(((props as EpProps).timing?.total ?? DURATION_S) * FPS)})}
  />
);
