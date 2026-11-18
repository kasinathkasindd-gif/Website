import React from 'react';
import {Composition} from 'remotion';
import {Ep001, DURATION_S} from './Ep001';
import {FPS, W, H} from './theme';

export const Root: React.FC = () => (
  <Composition id="Ep001Leh" component={Ep001} durationInFrames={DURATION_S * FPS} fps={FPS} width={W} height={H} />
);
