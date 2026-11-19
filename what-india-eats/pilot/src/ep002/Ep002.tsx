import React from 'react';
import {AbsoluteFill, interpolate, spring, useVideoConfig} from 'remotion';
import cfg from './timing.json';
import {EpProps, useShotFrame, useToReal} from '../timing';
import {Cam, Episode, Sfx, Shot} from '../engine';
import {Seetu, STEAM_POP, isBlinking, steamPath} from '../Seetu';
import {BurstBG, RouteBG, ROUTE_STOPS, Kettle, ThukpaBowl, Steam} from '../scenes/scenes';
import {Cue, HookText, MealChip, SteamMeter, DishCard, FactCard, Badge} from '../ui/ui';
import {FPS, CREAM, RED, WOOD, INK} from '../theme';
import {
  ChangthangBG, PrayerFlags, Tent, Yak, Goat, TsampaBowl, StewPot, ChurpePlate, Cube, TeaBowl, TentInteriorBG, DunesBG, Camel,
  YakEquation, WoolToShawl, ShawlOnSeetu, Clonk, DizzyStars, Snow,
} from './art';

// EP002 Changthang. Script: what-india-eats/04-scripts/ep002-changthang-ladakh.md. Cues, story beats and shot
// times live in timing.json (shared with scripts/build_timing.py). Every shot keeps something moving.

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const Full: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
    {children}
  </svg>
);
export const CUES: Cue[] = (cfg.cues as [number, number, string][]).map(([from, to, text]) => ({from, to, text}));
const S = Object.fromEntries((cfg.shots as [number, number, string][]).map(([a, b, n]) => [n, [a, b]])) as Record<string, [number, number]>;
const at = (name: string) => S[name][0];
const useT = (name: string) => {
  const f = useShotFrame();
  return {f, t: f / FPS, tA: at(name) + f / FPS};
};
const jump = (f: number, w: number, k = 10) => (f >= w ? Math.max(0, 1 - (f - w) / k) : 0);
const Table: React.FC<{y?: number}> = ({y = 1150}) => <rect x={110} y={y} width={860} height={40} rx={14} fill={WOOD} stroke={INK} strokeWidth={9} />;

// ---------------------------------------------------------------- shots
const ShotHook: React.FC<{loop?: boolean}> = ({loop}) => {
  const f = useShotFrame();
  // the loop shot plays the two seconds *before* frame 1, so the last frame matches the first
  const tA = loop ? f / FPS - 2.0 : f / FPS;
  const lid = loop ? 0 : interpolate(f, [10, 16, 40, 70], [0, -110, -70, -20], clamp);
  const shock = !loop && f >= 10;
  return (
    <AbsoluteFill>
      <Cam zoom={loop ? [1, 1] : [1, 1.08]} origin={[620, 1050]}>
        <ChangthangBG t={tA} tod="day" />
        <Full>
          <Snow t={tA} n={28} />
          <Yak x={400} y={1236} s={1.45} t={tA} flip breath />
          <Seetu
            id="hook"
            x={880}
            y={1232}
            scale={0.44}
            eyes={shock ? 'wide' : 'open'}
            brows={shock ? 'up' : 'neutral'}
            mouth={shock ? 'o' : 'smile'}
            lidLift={lid}
            lidTilt={lid * 0.08}
            steam={shock && f < 50 ? STEAM_POP : []}
            armL={shock ? 'up' : 'down'}
            armR={shock ? 'up' : 'down'}
            look={[-18, -12]}
            blink={isBlinking(f, 7)}
          />
        </Full>
      </Cam>
      {!loop && f >= 4 && <HookText key1="1 YAK" post=" A WINTER?!" />}
    </AbsoluteFill>
  );
};

const ShotRoute: React.FC = () => {
  const {f} = useT('route');
  const R = useToReal();
  const {fps} = useVideoConfig();
  const hop = spring({frame: f - 34, fps, config: {damping: 13, stiffness: 95}});
  const [, ax, ay] = ROUTE_STOPS[0];
  const [, bx, by] = ROUTE_STOPS[1];
  const trail = interpolate(f, [30, 60], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Cam zoom={[1.0, 1.05]} origin={[540, 640]}>
        <RouteBG progress={1} highlight={f > 52 ? 1 : 0} stamps={1} stopNo={2} />
        <Full>
          <path d={`M ${ax} ${ay} L ${ax + (bx - ax) * trail} ${ay + (by - ay) * trail}`} stroke={RED} strokeWidth={12} strokeLinecap="round" />
          <Seetu
            id="route"
            x={interpolate(hop, [0, 1], [ax - 150, bx + 150])}
            y={interpolate(hop, [0, 1], [ay + 40, by + 40]) - Math.sin(Math.min(1, hop) * Math.PI) * 140}
            scale={0.3}
            armL="down"
            armR={hop > 0.95 ? 'wave' : 'up'}
            wave={f / 12}
            mouth="big"
            blink={isBlinking(f, 3)}
          />
        </Full>
      </Cam>
      <Badge text="District 2 / 793" top={1110} delay={R(50)} bg={RED} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

const ShotArrival: React.FC = () => {
  const {f, tA} = useT('arrival');
  const R = useToReal();
  const yx = interpolate(f, [0, 52], [1380, 660], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 2)});
  const walking = f < 52;
  const bob = walking ? -Math.abs(Math.sin(tA * 7)) * 8 * 0.8 : 0;
  return (
    <AbsoluteFill>
      <Cam zoom={[1.06, 1.0]} origin={[540, 1050]}>
        <ChangthangBG t={tA} tod="day" />
        <Full>
          <PrayerFlags x1={60} y1={930} x2={420} y2={950} t={tA} />
          <Tent x={240} y={1070} s={0.62} t={tA} />
          <Goat x={520} y={1120} s={0.5} t={tA} phase={0} />
          <Goat x={980} y={1140} s={0.55} t={tA} sheep phase={1.4} flip />
          <Goat x={140} y={1230} s={0.6} t={tA} sheep phase={2.2} />
          <Goat x={900} y={1250} s={0.62} t={tA} phase={3.1} flip />
          <Yak x={yx} y={1236} s={0.82} t={tA} walk={walking} />
          <Seetu id="ride" x={yx + 10} y={1010 + bob} scale={0.33} eyes="happy" mouth="big" armL="up" armR={walking ? 'up' : 'wave'} wave={f / 12} />
        </Full>
      </Cam>
      <Badge text="📍 Changthang, Ladakh" top={210} delay={R(8)} />
    </AbsoluteFill>
  );
};

const ShotBreakfast: React.FC = () => {
  const {f, tA} = useT('breakfast');
  const R = useToReal();
  const tilt = interpolate(f, [16, 28, 64, 74], [0, 40, 40, 0], clamp);
  const pour = interpolate(f, [26, 32, 62, 66], [0, 1, 1, 0], clamp);
  const mix = interpolate(f, [70, 130], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Cam zoom={[1.0, 1.07]} origin={[380, 1080]}>
        <ChangthangBG t={tA} tod="dawn" horizon={900} />
        <Full>
          <Tent x={860} y={1000} s={0.42} t={tA} />
          <Goat x={620} y={1030} s={0.32} t={tA} phase={0.5} />
          <Goat x={700} y={1050} s={0.3} t={tA} sheep phase={2} flip />
          <Table />
          <TsampaBowl x={330} y={1150} mix={mix} t={tA} stir={f > 72} />
          <Steam x={330} y={1010} t={tA} n={2} scale={0.5} />
          <Kettle x={150} y={860} tilt={tilt} pour={pour} />
          <Seetu id="bf" x={770} y={1150} scale={0.6} eyes={mix > 0.5 ? 'happy' : 'open'} brows="up" mouth="smile" armL={f > 72 ? 'hold' : 'point'} armR="down" look={[-16, 6]} blink={isBlinking(f, 11)} />
        </Full>
      </Cam>
      <MealChip label="BREAKFAST" emoji="☀️" whistles={1} litAt={99999} />
      <DishCard name="tsampa" meaning="roasted barley flour, in salty butter tea" delay={R(10)} />
    </AbsoluteFill>
  );
};

const ShotSpice: React.FC = () => {
  const {f, tA} = useT('spice');
  const R = useToReal();
  const w = Math.round((16.7 - at('spice')) * FPS);
  const j = jump(f, w);
  const shrug = f > 10 && f < 40;
  return (
    <AbsoluteFill>
      <Cam zoom={[1.12, 1.18]} origin={[540, 1000]}>
        <ChangthangBG t={tA} tod="dawn" horizon={900} />
      </Cam>
      <Full>
        <Seetu
          id="spice"
          x={540}
          y={1240}
          scale={0.95}
          eyes={f < w ? 'squint' : 'wide'}
          brows={f < w ? 'suspicious' : 'up'}
          mouth={f < w ? 'flat' : 'o'}
          armL={shrug ? 'up' : 'down'}
          armR={shrug ? 'up' : 'chin'}
          look={[18, -10]}
          lidLift={-j * 60}
          steam={f >= w && f < w + 12 ? [steamPath(500, 250, 46)] : []}
        />
      </Full>
      <SteamMeter level={0} appearAt={0} scale={1.6} />
      <MealChip label="BREAKFAST" emoji="☀️" whistles={1} litAt={R(w)} />
    </AbsoluteFill>
  );
};

const ShotLunch: React.FC = () => {
  const {f, tA} = useT('lunch');
  const R = useToReal();
  const cheese = Math.round((20.8 - at('lunch')) * FPS);
  const slide = interpolate(f, [cheese, cheese + 14], [1, 0], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3)});
  return (
    <AbsoluteFill>
      <Cam zoom={[1.0, 1.06]} pan={[-30, 0]} origin={[540, 1100]}>
        <ChangthangBG t={tA} tod="day" />
        <Full>
          <Tent x={860} y={1030} s={0.5} t={tA} />
          <Goat x={560} y={1060} s={0.36} t={tA} phase={1} />
          <StewPot x={320} y={1130} t={tA} />
          <Steam x={320} y={990} t={tA} n={3} scale={0.7} />
          {f >= cheese && (
            <g transform={`translate(${slide * 700} 0)`}>
              <ChurpePlate x={600} y={1215} />
            </g>
          )}
          <Seetu
            id="lunch"
            x={800}
            y={1150}
            scale={0.6}
            eyes={f < cheese ? 'closed' : 'wide'}
            brows="up"
            mouth={f < cheese ? 'smile' : 'o'}
            armL={f < cheese ? 'down' : 'point'}
            armR="cheeks"
            look={[-14, 8]}
            steam={f < cheese ? [steamPath(500, 220, 22 + 4 * Math.sin(tA * 3))] : []}
          />
        </Full>
      </Cam>
      <MealChip label="LUNCH" emoji="🍲" whistles={2} litAt={99999} />
      {f < cheese - 4 && <DishCard name="stew" meaning="yak or mutton, simmered" delay={R(12)} />}
      {f >= cheese && <DishCard name="churpe" meaning="dried cheese" delay={R(cheese + 2)} />}
    </AbsoluteFill>
  );
};

const ShotCheese: React.FC = () => {
  const {f, tA} = useT('cheese');
  const R = useToReal();
  const bite = Math.round((24.3 - at('cheese')) * FPS);
  const dunkAt = 60;
  const w = Math.round((28.0 - at('cheese')) * FPS);
  const hit = f - bite;
  const shake = hit >= 0 && hit < 9 ? Math.sin(hit * 2.6) * 14 * (1 - hit / 9) : 0;
  const dunk = interpolate(f, [dunkAt, dunkAt + 40], [0, 1], clamp);
  const phase = f < bite ? 'bite' : f < bite + 34 ? 'ow' : f < dunkAt ? 'think' : 'soft';
  const j = jump(f, w);
  const SX = 720;
  const SY = 1160;
  const SS = 0.78;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${-shake * 0.4}px)`}}>
      <Cam zoom={[1.08, 1.14]} origin={[540, 1050]}>
        <ChangthangBG t={tA} tod="day" />
        <Full>
          <Table y={1160} />
          <TeaBowl x={300} y={1160} t={tA} dunk={dunk} />
          <Seetu
            id="cheese"
            x={SX}
            y={SY}
            scale={SS}
            eyes={phase === 'bite' ? 'happy' : phase === 'ow' ? 'wide' : phase === 'think' ? 'squint' : 'happy'}
            brows={phase === 'ow' ? 'worried' : phase === 'think' ? 'suspicious' : 'up'}
            mouth={phase === 'bite' ? 'big' : phase === 'ow' ? 'wavy' : phase === 'think' ? 'flat' : 'chew'}
            blush={phase === 'soft'}
            armL="down"
            armR={phase === 'bite' || phase === 'ow' ? 'chin' : phase === 'think' ? 'point' : 'cheeks'}
            lidLift={phase === 'ow' ? -Math.max(0, 1 - hit / 12) * 90 : -j * 55}
            lidTilt={phase === 'ow' ? Math.sin(hit * 1.5) * 8 * Math.max(0, 1 - hit / 20) : 0}
            look={phase === 'think' ? [-20, 6] : [0, 0]}
          />
          {f < dunkAt && <Cube x={SX + 70 * SS} y={SY - 150 * SS} s={1.1} />}
          <DizzyStars x={SX} y={SY - 530 * SS} f={hit} r={130} />
          <Clonk x={SX - 40} y={SY - 600 * SS} f={hit} />
        </Full>
      </Cam>
      <MealChip label="LUNCH" emoji="🍲" whistles={2} litAt={R(w)} />
    </AbsoluteFill>
  );
};

const ShotDinner: React.FC = () => {
  const {f, tA} = useT('dinner');
  const R = useToReal();
  const {fps} = useVideoConfig();
  const again = Math.round((32.4 - at('dinner')) * FPS);
  const w = Math.round((34.2 - at('dinner')) * FPS);
  const hop = f >= again ? spring({frame: f - again, fps, config: {damping: 7, stiffness: 200}}) : 0;
  const j = jump(f, w, 9);
  return (
    <AbsoluteFill>
      <Cam zoom={[1.0, 1.07]} origin={[540, 1050]}>
        <TentInteriorBG t={tA} />
        <Full>
          <ThukpaBowl x={380} y={1110} />
          <Steam x={380} y={960} t={tA} n={3} scale={0.8} />
          <Seetu
            id="dinner"
            x={730}
            y={1124}
            scale={0.62}
            eyes={f >= again && f < again + 12 ? 'wide' : 'happy'}
            brows="up"
            mouth={f >= again ? 'big' : 'smile'}
            blush
            armL={f >= again ? 'up' : 'warm'}
            armR={f >= again ? 'up' : 'cheeks'}
            squash={f >= again ? 1 - 0.12 * (1 - hop) : 1}
            lidLift={-j * 50}
            steam={f >= w && f < w + 10 ? [steamPath(500, 250, 40)] : [steamPath(500, 215, 16 + 4 * Math.sin(tA * 3))]}
          />
        </Full>
      </Cam>
      <MealChip label="DINNER" emoji="🌙" whistles={3} litAt={R(w)} />
      <DishCard name="thukpa" meaning="warm noodle soup" delay={R(10)} />
    </AbsoluteFill>
  );
};

const ShotFactYak: React.FC = () => {
  const {f, t, tA} = useT('fact_yak');
  const R = useToReal();
  const lid = interpolate(f, [0, 6, 24, 40], [0, -110, -70, -10], clamp);
  const move = interpolate(f, [40, 62], [0, 1], {...clamp, easing: (v) => v * v * (3 - 2 * v)});
  return (
    <AbsoluteFill>
      <BurstBG t={t} c1={CREAM} c2="#FFE7B0" />
      <Full>
        <Snow t={tA} n={36} speed={70} />
        <YakEquation f={f} t={tA} />
        <Seetu
          id="factyak"
          x={interpolate(move, [0, 1], [540, 930])}
          y={interpolate(move, [0, 1], [820, 760])}
          scale={interpolate(move, [0, 1], [0.42, 0.3])}
          eyes="wide"
          brows="up"
          mouth={f < 40 ? 'o' : 'big'}
          lidLift={lid}
          lidTilt={lid * 0.08}
          steam={f < 40 ? STEAM_POP : []}
          armL="up"
          armR="up"
          look={move > 0.5 ? [-14, 8] : [0, -10]}
        />
      </Full>
      <FactCard text="A nomad family may eat 1 yak, or 3–4 sheep or goats, each winter." source="Hussain, Spaldon & Tundup, IJTK (2022)" delay={R(126)} />
    </AbsoluteFill>
  );
};

const ShotFactPashmina: React.FC = () => {
  const {f, tA} = useT('fact_pashmina');
  const R = useToReal();
  const wool = interpolate(f, [12, 84], [0, 1], clamp);
  const wrap = interpolate(f, [78, 100], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Cam zoom={[1.0, 1.06]} origin={[540, 1050]}>
        <ChangthangBG t={tA} tod="day" />
        <Full>
          <Goat x={330} y={1180} s={1.55} t={tA} phase={0.3} longHorns />
          <WoolToShawl p={wool} t={tA} from={[300, 960]} to={[780, 900]} />
          <Seetu id="pash" x={790} y={1160} scale={0.6} eyes={wrap > 0.5 ? 'happy' : 'open'} brows="up" mouth={wrap > 0.5 ? 'smile' : 'o'} blush={wrap > 0.5} armL="down" armR="cheeks" look={[-14, -6]} />
          <ShawlOnSeetu x={790} y={1160} s={0.6} p={wrap} t={tA} />
        </Full>
      </Cam>
      <FactCard text="Changpa herders: among India's top pashmina (cashmere) producers" source="UNDP India" delay={R(20)} />
    </AbsoluteFill>
  );
};

const ShotCliff: React.FC = () => {
  const {f} = useT('cliff');
  const R = useToReal();
  const stampY = interpolate(f, [0, 8], [-300, 0], {...clamp, easing: (v) => v * v});
  const stampUp = interpolate(f, [14, 24], [0, -500], clamp);
  const walk = interpolate(f, [30, 90], [0, 1], clamp);
  const [, ax, ay] = ROUTE_STOPS[1];
  const [, bx, by] = ROUTE_STOPS[2];
  return (
    <AbsoluteFill>
      <Cam zoom={[1.0, 1.05]} origin={[540, 700]}>
        <RouteBG progress={1} stamps={f >= 8 ? 2 : 1} highlight={f > 70 ? 2 : 1} stopNo={2} />
        <Full>
          <Seetu
            id="cliff"
            x={interpolate(walk, [0, 1], [ax + 150, bx - 150])}
            y={interpolate(walk, [0, 1], [ay + 40, by + 40])}
            scale={0.3}
            flip
            walk={walk > 0 && walk < 1 ? f * 0.5 : null}
            eyes="happy"
            mouth="big"
            armL="down"
            armR={walk >= 1 ? 'wave' : 'down'}
            wave={f / 12}
          />
          <g transform={`translate(${ax} ${ay - 60 + stampY + stampUp})`} opacity={f > 24 ? 0 : 1}>
            <rect x={-60} y={-150} width={120} height={110} rx={16} fill="#9A6B43" stroke={INK} strokeWidth={8} />
            <rect x={-80} y={-44} width={160} height={40} rx={10} fill={RED} stroke={INK} strokeWidth={8} />
          </g>
        </Full>
      </Cam>
      <Badge text="District 2 ✓  ·  Next: 3 / 793" top={1110} delay={R(10)} bg={RED} color="#FFFFFF" size={44} />
    </AbsoluteFill>
  );
};

const ShotNubra: React.FC = () => {
  const {f, tA} = useT('nubra');
  const R = useToReal();
  const cx = interpolate(f, [0, 63], [1180, 760], clamp);
  return (
    <AbsoluteFill>
      <Cam zoom={[1.04, 1.0]} origin={[540, 1100]}>
        <DunesBG t={tA} />
        <Full>
          <Camel x={cx} y={1180} s={0.95} t={tA} />
          <Seetu id="nubra" x={250} y={1200} scale={0.42} eyes="happy" mouth="big" armL="down" armR="wave" wave={f / 12} look={[16, -4]} />
        </Full>
      </Cam>
      <Badge text="Next: Nubra" top={230} delay={R(2)} />
    </AbsoluteFill>
  );
};

const ShotLoop: React.FC = () => {
  const f = useShotFrame();
  return (
    <AbsoluteFill>
      <ShotHook loop />
      {f > 4 && f < 48 && <Badge text="Follow the journey →" top={230} delay={5} bg="#FFFFFF" />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sound (script seconds)
const SFX: Sfx[] = [
  {f: 'yak', at: 0.05, db: -6},
  {f: 'wind', at: 0.0, db: -22, dur: 3.0, duck: true},
  {f: 'steam_burst', at: 0.36, db: -10},
  {f: 'whoosh', at: 2.98, db: -14},
  {f: 'twinkle', at: 3.3, db: -16},
  {f: 'hop', at: 4.15, db: -10},
  {f: 'whoosh', at: 6.28, db: -14},
  {f: 'herd', at: 6.3, db: -15, dur: 3.3, duck: true},
  {f: 'hooves', at: 6.3, db: -12, dur: 1.75},
  {f: 'wind', at: 6.3, db: -23, dur: 8.3, duck: true},
  {f: 'bed_breakfast', at: 9.6, db: -12, dur: 7.6, duck: true},
  {f: 'pour', at: 10.5, db: -12},
  {f: 'squish', at: 12.5, db: -13},
  {f: 'pfft', at: 15.6, db: -9},
  {f: 'whistle_G5', at: 16.7, db: -5},
  {f: 'bed_lunch', at: 17.2, db: -13, dur: 11.2, duck: true},
  {f: 'bubbles', at: 17.2, db: -17, dur: 6.8, duck: true},
  {f: 'fire', at: 17.2, db: -21, dur: 6.8, duck: true},
  {f: 'clink', at: 20.9, db: -12},
  {f: 'clonk', at: 24.3, db: -4},
  {f: 'tumble', at: 24.42, db: -15},
  {f: 'plop', at: 26.6, db: -8},
  {f: 'whistle_B5', at: 28.0, db: -5},
  {f: 'bed_dinner', at: 28.4, db: -12, dur: 6.4, duck: true},
  {f: 'fire', at: 28.4, db: -18, dur: 6.4, duck: true},
  {f: 'wind', at: 28.4, db: -27, dur: 6.4, duck: true},
  {f: 'pop', at: 32.45, db: -10},
  {f: 'whistle_D6', at: 34.2, db: -5},
  {f: 'steam_burst', at: 34.85, db: -9},
  {f: 'riser', at: 34.9, db: -15},
  {f: 'whoosh', at: 35.4, db: -14},
  {f: 'pop', at: 36.27, db: -10},
  {f: 'pop', at: 36.75, db: -11},
  {f: 'pop', at: 37.15, db: -11},
  {f: 'pop', at: 37.55, db: -11},
  {f: 'pop', at: 37.95, db: -13},
  {f: 'ding', at: 39.0, db: -9},
  {f: 'whoosh', at: 42.98, db: -14},
  {f: 'twinkle', at: 43.5, db: -14},
  {f: 'twinkle', at: 45.7, db: -13},
  {f: 'stamp', at: 48.27, db: -6},
  {f: 'sting', at: 48.4, db: -3},
  {f: 'whoosh', at: 51.48, db: -14},
  {f: 'wind', at: 51.5, db: -20, dur: 2.1, duck: true},
  {f: 'steam_burst', at: 55.4, db: -16},
];

const SHOTS: Shot[] = (cfg.shots as [number, number, string][]).map(([a, b, n]) => [
  a,
  b,
  ({hook: ShotHook, route: ShotRoute, arrival: ShotArrival, breakfast: ShotBreakfast, spice: ShotSpice, lunch: ShotLunch, cheese: ShotCheese, dinner: ShotDinner, fact_yak: ShotFactYak, fact_pashmina: ShotFactPashmina, cliff: ShotCliff, nubra: ShotNubra, loop: ShotLoop} as Record<string, React.FC>)[n],
]);
export const DURATION_S = cfg.end as number;

export const Ep002: React.FC<EpProps> = (props) => <Episode props={props} cues={CUES} shots={SHOTS} sfx={SFX} durationS={DURATION_S} />;
