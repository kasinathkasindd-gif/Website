// node scripts/render.cjs stills|preview|final [times]
// stills: PNG frames at key times (scale 0.5) for a contact sheet
// preview: 540x960 MP4; final: 1080x1920 MP4 (CRF 18)
// EP_PROPS=path/to/props.json  -> input props, e.g. {"timing": <build_timing.py output>, "sprites": true}
// EP_OUT=name.mp4               -> output file name in out/
// REMOTION_BROWSER=/path/to/chrome-headless-shell (else the local Playwright one, else Remotion downloads one)
const path = require('path');
const fs = require('fs');
const {bundle} = require('@remotion/bundler');
const {selectComposition, renderMedia, renderStill} = require('@remotion/renderer');

const CANDIDATES = [
  process.env.REMOTION_BROWSER,
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
];
const BROWSER = CANDIDATES.find((p) => p && fs.existsSync(p)) || null;
const inputProps = process.env.EP_PROPS ? JSON.parse(fs.readFileSync(process.env.EP_PROPS, 'utf8')) : {};
const mode = process.argv[2] || 'preview';
const root = path.join(__dirname, '..');
const out = path.join(root, 'out');
fs.mkdirSync(out, {recursive: true});

(async () => {
  const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
  const composition = await selectComposition({serveUrl, id: 'Ep001Leh', browserExecutable: BROWSER, inputProps});
  const common = {composition, serveUrl, browserExecutable: BROWSER, inputProps, chromiumOptions: {gl: 'swangle'}};
  if (mode === 'stills') {
    const times = (process.argv[3] || '0.3,1.2,3,5,6.6,7.3,8.5,11,12.8,14,14.7,17,19,22,23.3,24.2,27,30.8,32,34,38,40,42,43.5,45').split(',').map(Number);
    for (const t of times) {
      const frame = Math.min(composition.durationInFrames - 1, Math.round(t * composition.fps));
      const file = path.join(out, `still_${String(t).padStart(5, '0')}.png`);
      await renderStill({...common, frame, output: file, scale: 0.5});
      console.log('still', t, file);
    }
    return;
  }
  const final = mode === 'final';
  const file = path.join(out, process.env.EP_OUT || (final ? 'ep001-leh-animatic-1080x1920.mp4' : 'ep001-leh-animatic-preview.mp4'));
  await renderMedia({
    ...common,
    codec: 'h264',
    outputLocation: file,
    scale: final ? 1 : 0.5,
    crf: final ? 18 : 23,
    pixelFormat: 'yuv420p',
    imageFormat: 'jpeg',
    jpegQuality: final ? 92 : 80,
    concurrency: Number(process.env.EP_CONCURRENCY) || require('os').cpus().length,
    onProgress: ({progress}) => {
      const p = Math.round(progress * 100);
      if (p % 10 === 0) process.stdout.write(`\r${mode} ${p}%   `);
    },
  });
  console.log('\nrendered', file);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
