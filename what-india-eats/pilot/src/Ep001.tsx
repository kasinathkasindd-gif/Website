import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Seetu, STEAM_POP, STEAM_SPICY, isBlinking, steamPath} from './Seetu';
import {
  BurstBG, KitchenBG, ExteriorBG, RouteBG, PlateauBG, ROUTE_STOPS, Jeep, TeaCup, Steam, Churn, BarleyBowl, Kettle,
  Khambir, Thali, ThukpaBowl, CousinCooker, HostHandLadle, Sack,
} from './scenes/scenes';
import {Captions, Cue, HookText, MealChip, SteamMeter, DishCard, FactCard, Badge, SpeechBubble, Fonts} from './ui/ui';
import {sec, FPS, CREAM, INK, RED, FONT_HEAD} from './theme';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const Full: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
    {children}
  </svg>
);

// Script: what-india-eats/04-scripts/ep001-leh-ladakh.md (captions = the clean VO, verbatim)
export const CUES: Cue[] = [
  {from: 0.15, to: 1.8, text: 'Breakfast here is… salty tea.'},
  {from: 1.9, to: 3.4, text: "I'm Seetu, a pressure cooker,"},
  {from: 3.4, to: 5.5, text: "and I'm eating with a family in every district of India."},
  {from: 5.5, to: 7.5, text: 'Stop one: Leh, Ladakh!'},
  {from: 7.6, to: 8.9, text: 'Many homes start with gur-gur cha:'},
  {from: 8.9, to: 10.45, text: 'tea churned with butter and salt…'},
  {from: 10.5, to: 11.3, text: '…with khambir bread, or kholak:'},
  {from: 11.3, to: 12.25, text: 'roasted barley mixed right into the tea.'},
  {from: 12.25, to: 13.5, text: 'No cooking. Fuel is precious up here.'},
  {from: 13.6, to: 15.0, text: 'Spice? Zero puffs.'},
  {from: 15.2, to: 20.9, text: 'Lunch in many homes? Rice, dal and vegetables.'},
  {from: 21.0, to: 22.6, text: 'Every day… or just for guests?'},
  {from: 23.45, to: 24.5, text: 'No no no… okay. Just one more.'},
  {from: 24.6, to: 26.2, text: 'Dinner: a steaming bowl of thukpa,'},
  {from: 26.2, to: 27.8, text: 'noodle soup with vegetables, sometimes meat.'},
  {from: 27.8, to: 31.0, text: "Up here, hot soup isn't a treat. It's survival."},
  {from: 31.1, to: 35.0, text: 'Mind blown: researchers found rice used to be a luxury in Ladakh.'},
  {from: 35.0, to: 37.6, text: 'Today, cheap subsidised rice from the plains is everyday food,'},
  {from: 37.6, to: 39.4, text: 'and local barley is fading.'},
  {from: 39.6, to: 41.8, text: 'Three whistles — done!'},
  {from: 41.8, to: 44.0, text: 'Just one more… Changthang!'},
];

// ---------------------------------------------------------------- shots
const ShotHook: React.FC<{loop?: boolean}> = ({loop}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const rise = loop ? 0 : spring({frame: f - 2, fps, config: {damping: 11, stiffness: 160}});
  const lid = loop ? 0 : interpolate(f, [3, 9, 30, 50], [0, -105, -60, -20], clamp);
  return (
    <AbsoluteFill>
      <BurstBG t={loop ? 0 : t} />
      <Full>
        <TeaCup x={450} y={1150} s={1.15} />
        <Steam x={450} y={930} t={t} n={3} scale={1.3} />
        {!loop && (
          <Seetu
            id="hook"
            x={860}
            y={1215 + (1 - rise) * 760}
            scale={0.6}
            eyes="wide"
            brows="up"
            mouth="o"
            lidLift={lid}
            lidTilt={lid * 0.08}
            steam={f > 3 ? STEAM_POP : []}
            armL="up"
            armR="up"
          />
        )}
      </Full>
      {!loop && <HookText key1="SALTY" post=" TEA?!" />}
    </AbsoluteFill>
  );
};

const ShotRoute: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const prog = interpolate(f, [0, 40], [0, 1], clamp);
  const jump = spring({frame: f - 18, fps, config: {damping: 14, stiffness: 90}});
  const [lx, ly] = [ROUTE_STOPS[0][1], ROUTE_STOPS[0][2]];
  const x = interpolate(jump, [0, 1], [540, lx - 165]);
  const y = interpolate(jump, [0, 1], [2050, ly + 40]) - Math.sin(jump * Math.PI) * 300;
  return (
    <AbsoluteFill>
      <RouteBG progress={prog} highlight={0} />
      <Full>
        <Seetu id="route" x={x} y={y} scale={0.3} armR={jump > 0.95 ? 'wave' : 'up'} armL="down" wave={f / 14} blink={isBlinking(f)} mouth="big" />
      </Full>
      <Badge text="District 1 / 793" top={1110} delay={6} bg={RED} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

const ShotArrival: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const jx = interpolate(f, [0, 24], [1500, 700], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3)});
  const bounce = f < 26 ? Math.sin(f * 1.3) * 6 : 0;
  const door = interpolate(f, [24, 30], [0, 1], clamp);
  const out = interpolate(f, [28, 44], [0, 1], clamp);
  const sx = jx + 30;
  const sy = interpolate(out, [0, 1], [1330, 1236]) - Math.sin(out * Math.PI) * 300;
  const land = f > 44 ? spring({frame: f - 44, fps, config: {damping: 6, stiffness: 220}}) : 0;
  return (
    <AbsoluteFill>
      <ExteriorBG />
      <Full>
        <Jeep x={jx} y={1424} bounce={bounce} doorOpen={0} />
        {f >= 28 && (
          <Seetu
            id="arr"
            x={sx}
            y={sy}
            scale={0.4}
            rotate={out < 1 ? -out * 360 : 0}
            squash={f > 44 ? 1 - 0.18 * (1 - land) : 1}
            eyes={out < 1 ? 'wide' : 'open'}
            mouth={out < 1 ? 'o' : 'big'}
            armL="up"
            armR={f > 50 ? 'wave' : 'up'}
            wave={f / 12}
            blink={isBlinking(f, 30)}
          />
        )}
      </Full>
      <Badge text="📍 Leh, Ladakh" top={210} delay={4} />
    </AbsoluteFill>
  );
};

const ShotBreakfastA: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const plunge = (Math.sin(t * Math.PI * 2 * 1.6) + 1) / 2;
  return (
    <AbsoluteFill>
      <KitchenBG t={t} />
      <Full>
        <Churn x={250} y={1155} plunge={plunge} />
        <Steam x={360} y={980} t={t} n={2} scale={0.6} />
        <Seetu id="bfa" x={640} y={1155} scale={0.62} eyes="closed" brows="up" mouth="smile" armL="down" armR="cheeks" look={[-10, 0]} steam={[steamPath(500, 220, 26)]} />
      </Full>
      <MealChip label="BREAKFAST" emoji="☀️" whistles={1} litAt={99999} />
      <DishCard name="gur-gur cha" meaning="butter tea, churned with butter and salt" delay={8} />
    </AbsoluteFill>
  );
};

const ShotBreakfastB: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const tilt = interpolate(f, [0, 10, 34, 42], [0, 38, 38, 0], clamp);
  const pour = interpolate(f, [10, 16, 32, 36], [0, 1, 1, 0], clamp);
  const dough = interpolate(f, [38, 62], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <KitchenBG t={t} />
      <Full>
        <BarleyBowl x={280} y={1155} dough={dough} />
        <Kettle x={140} y={870} tilt={tilt} pour={pour} />
        <Khambir x={520} y={1120} />
        <text x={520} y={1050} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={34} fill={INK}>khambir</text>
        <Seetu id="bfb" x={740} y={1155} scale={0.6} eyes="open" brows="neutral" mouth="smile" armL="point" armR="down" look={[-16, 6]} blink={isBlinking(f, 11)} />
      </Full>
      <MealChip label="BREAKFAST" emoji="☀️" whistles={1} litAt={99999} />
      <DishCard name="kholak" meaning="roasted-barley flour kneaded with butter tea" delay={4} />
    </AbsoluteFill>
  );
};

const ShotSpice: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const w = 30; // meal-1 whistle frame (14.5 s)
  const jump = f >= w ? Math.max(0, 1 - (f - w) / 10) : 0;
  return (
    <AbsoluteFill>
      <KitchenBG t={t} />
      <Full>
        <Seetu
          id="spice"
          x={520}
          y={1245}
          scale={0.95}
          eyes={f < w ? 'squint' : 'wide'}
          brows={f < w ? 'suspicious' : 'up'}
          mouth={f < w ? 'flat' : 'o'}
          look={[18, -10]}
          armR="chin"
          armL="down"
          lidLift={-jump * 60}
          steam={f >= w && f < w + 12 ? [steamPath(500, 250, 46)] : []}
        />
      </Full>
      <SteamMeter level={0} appearAt={0} scale={1.6} />
      <MealChip label="BREAKFAST" emoji="☀️" whistles={1} litAt={w} />
    </AbsoluteFill>
  );
};

const ShotLunch: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const w = 168; // meal-2 whistle (20.6 s)
  const jet = interpolate(f, [8, 14, 32, 40], [0, 1, 1, 0], clamp);
  const chewing = f > 60 && f < w && Math.floor(f / 7) % 2 === 0;
  const jump = f >= w ? Math.max(0, 1 - (f - w) / 10) : 0;
  return (
    <AbsoluteFill>
      <KitchenBG t={t} />
      <Full>
        <CousinCooker x={890} y={968} jet={jet} />
        <Thali x={330} y={1155} />
        <Steam x={250} y={1050} t={t} n={2} scale={0.5} />
        <Seetu
          id="lunch"
          x={700}
          y={1155}
          scale={0.62}
          eyes={f > 60 ? 'happy' : 'open'}
          brows="up"
          mouth={f > 60 ? (chewing ? 'chew' : 'big') : 'o'}
          blush={f > 60}
          armL="point"
          armR="cheeks"
          look={[-14, 4]}
          blink={f <= 60 && isBlinking(f, 5)}
          lidLift={-jump * 50}
          steam={f >= w && f < w + 12 ? [steamPath(500, 250, 40)] : []}
        />
      </Full>
      <MealChip label="LUNCH" emoji="🍚" whistles={2} litAt={w} />
      <DishCard name="daal-chawal" meaning="rice and lentils, with vegetables" delay={44} />
    </AbsoluteFill>
  );
};

const ShotGuests: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const handIn = interpolate(f, [50, 66], [0, 1], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3)});
  const handOut = interpolate(f, [84, 100], [0, 1], clamp);
  const tip = interpolate(f, [66, 76], [0, 1], clamp);
  const rice = 1 + 0.32 * interpolate(f, [70, 80], [0, 1], clamp);
  const phase = f < 50 ? 'squint' : f < 72 ? 'refuse' : 'givein';
  return (
    <AbsoluteFill>
      <KitchenBG t={t} />
      <Full>
        <Thali x={330} y={1155} rice={rice} />
        <HostHandLadle x={interpolate(handIn - handOut, [0, 1], [1400, 560])} y={970} tip={tip} />
        <Seetu
          id="guest"
          x={720}
          y={1155}
          scale={0.62}
          eyes={phase === 'squint' ? 'squint' : phase === 'refuse' ? 'wide' : 'happy'}
          brows={phase === 'squint' ? 'suspicious' : phase === 'refuse' ? 'worried' : 'up'}
          mouth={phase === 'squint' ? 'flat' : phase === 'refuse' ? 'o' : 'smile'}
          blush={phase === 'givein'}
          armL={phase === 'refuse' ? 'stop' : 'down'}
          armR={phase === 'squint' ? 'chin' : phase === 'refuse' ? 'stop' : 'down'}
          look={phase === 'squint' ? [-18, 8] : [0, 0]}
        />
      </Full>
      <MealChip label="LUNCH" emoji="🍚" whistles={2} litAt={99999} />
      <SpeechBubble text="Every day!" x={560} y={600} delay={48} tail="right" />
    </AbsoluteFill>
  );
};

const ShotDinner: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const w = 186; // meal-3 whistle (30.7 s)
  const jump = f >= w ? Math.max(0, 1 - (f - w) / 9) : 0;
  return (
    <AbsoluteFill>
      <KitchenBG night t={t} />
      <Full>
        <ThukpaBowl x={380} y={1150} />
        <Steam x={380} y={1000} t={t} n={3} scale={0.8} />
        <Seetu
          id="dinner"
          x={690}
          y={1155}
          scale={0.62}
          eyes="happy"
          brows="up"
          mouth="smile"
          blush
          armL="warm"
          armR="cheeks"
          lidLift={-jump * 50}
          steam={f >= w && f < w + 10 ? [steamPath(500, 250, 40)] : [steamPath(500, 215, 18 + 4 * Math.sin(t * 3))]}
        />
      </Full>
      <MealChip label="DINNER" emoji="🌙" whistles={3} litAt={w} />
      <DishCard name="thukpa" meaning="noodle soup with vegetables, sometimes meat" delay={6} />
    </AbsoluteFill>
  );
};

const ShotFact: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const lid = interpolate(f, [0, 6, 24, 40], [0, -110, -70, -10], clamp);
  const barleyIn = spring({frame: f - 22, fps, config: {damping: 12}});
  const riceIn = spring({frame: f - 44, fps, config: {damping: 12}});
  const arrow = interpolate(f, [60, 80], [0, 1], clamp);
  const fade = interpolate(f, [150, 220], [1, 0.45], clamp);
  const grow = interpolate(f, [150, 220], [1, 1.12], clamp);
  return (
    <AbsoluteFill>
      <BurstBG t={t} c1={CREAM} c2="#FFE7B0" />
      <Full>
        <g transform={`translate(0 ${(1 - barleyIn) * 700})`}>
          <Sack x={270} y={1180} label="BARLEY" tag="THEN" grain="barley" fade={fade} />
        </g>
        <g transform={`translate(0 ${(1 - riceIn) * 700})`}>
          <Sack x={810} y={1180} label="RICE" tag="NOW" grain="rice" s={grow} />
        </g>
        <g opacity={arrow}>
          <path d={`M 450 840 L ${450 + 180 * arrow} 840`} stroke={INK} strokeWidth={22} strokeLinecap="round" />
          <path d={`M ${610 * arrow + 20 * (1 - arrow)} 800 l 50 40 l -50 40`} stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
        </g>
        <Seetu
          id="fact"
          x={540}
          y={1200}
          scale={0.42}
          eyes="wide"
          brows="up"
          mouth={f < 60 ? 'o' : 'big'}
          lidLift={lid}
          lidTilt={lid * 0.08}
          steam={f < 40 ? STEAM_POP : []}
          armL="up"
          armR="up"
          look={[0, -14]}
        />
      </Full>
      <FactCard text="Rice was a luxury here. Now it's everyday." source="Dame & Nüsser, Food Security (2011)" delay={26} />
    </AbsoluteFill>
  );
};

const ShotCliff: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stampY = interpolate(f, [0, 8], [-300, 0], {...clamp, easing: (v) => v * v});
  const stampUp = interpolate(f, [14, 24], [0, -500], clamp);
  const walk = interpolate(f, [30, 80], [0, 1], clamp);
  const [ax, ay] = [ROUTE_STOPS[0][1], ROUTE_STOPS[0][2]];
  const [bx, by] = [ROUTE_STOPS[1][1], ROUTE_STOPS[1][2]];
  if (f < 84) {
    return (
      <AbsoluteFill>
        <RouteBG progress={1} stamped={f >= 8} highlight={f > 60 ? 1 : 0} />
        <Full>
          <Seetu
            id="cliff"
            x={interpolate(walk, [0, 1], [ax - 165, bx + 165])}
            y={interpolate(walk, [0, 1], [ay + 40, by + 40])}
            scale={0.3}
            walk={walk > 0 && walk < 1 ? f * 0.5 : null}
            eyes="happy"
            mouth="big"
            armL="down"
            armR={walk >= 1 ? 'wave' : 'down'}
            wave={f / 12}
          />
          <g transform={`translate(${ax} ${ay - 60 + stampY + stampUp})`}>
            <rect x={-60} y={-150} width={120} height={110} rx={16} fill="#9A6B43" stroke={INK} strokeWidth={8} />
            <rect x={-80} y={-44} width={160} height={40} rx={10} fill={RED} stroke={INK} strokeWidth={8} />
          </g>
        </Full>
        <Badge text="District 1 ✓  ·  Next: 2 / 793" top={1110} delay={10} bg={RED} color="#FFFFFF" size={44} />
      </AbsoluteFill>
    );
  }
  const g = f - 84;
  const inX = interpolate(g, [0, 40], [-200, 210], clamp);
  return (
    <AbsoluteFill>
      <PlateauBG />
      <Full>
        <Seetu id="cliff2" x={inX} y={1190} scale={0.38} walk={g < 40 ? g * 0.5 : null} eyes="open" mouth="big" armL="down" armR={g >= 40 ? 'wave' : 'down'} wave={g / 12} blink={isBlinking(g)} />
      </Full>
      <Badge text="Next: Changthang" top={230} delay={2} />
    </AbsoluteFill>
  );
};

const ShotLoop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ShotHook loop />
      {f > 4 && f < 48 && <Badge text="Follow the journey →" top={230} delay={5} bg="#FFFFFF" />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sound
type S = {f: string; at: number; db: number; dur?: number};
const SFX: S[] = [
  {f: 'whistle_hook', at: 0.0, db: -3},
  {f: 'steam_burst', at: 0.05, db: -9},
  {f: 'whoosh', at: 1.78, db: -14},
  {f: 'hop', at: 2.45, db: -10},
  {f: 'twinkle', at: 3.3, db: -16},
  {f: 'whoosh', at: 5.48, db: -14},
  {f: 'jeep', at: 5.5, db: -9},
  {f: 'wind', at: 5.5, db: -18, dur: 2.0},
  {f: 'door', at: 6.35, db: -10},
  {f: 'tumble', at: 6.45, db: -14},
  {f: 'land', at: 6.98, db: -8},
  {f: 'bed_breakfast', at: 7.5, db: -11, dur: 7.5},
  {f: 'churn', at: 7.6, db: -8, dur: 2.9},
  {f: 'pour', at: 10.85, db: -12},
  {f: 'squish', at: 11.8, db: -10},
  {f: 'pfft', at: 13.85, db: -9},
  {f: 'whistle_G5', at: 14.5, db: -5},
  {f: 'bed_lunch', at: 15.0, db: -12, dur: 9.5},
  {f: 'cousin_whistle', at: 15.27, db: -10},
  {f: 'clink', at: 16.6, db: -12},
  {f: 'whistle_B5', at: 20.6, db: -5},
  {f: 'pop', at: 22.6, db: -9},
  {f: 'clink', at: 23.25, db: -9},
  {f: 'whoosh', at: 24.45, db: -15},
  {f: 'bed_dinner', at: 24.5, db: -11, dur: 6.5},
  {f: 'wind', at: 24.5, db: -24, dur: 6.5},
  {f: 'whistle_D6', at: 30.7, db: -5},
  {f: 'steam_burst', at: 31.0, db: -9},
  {f: 'riser', at: 31.05, db: -15},
  {f: 'ding', at: 31.9, db: -9},
  {f: 'whoosh', at: 31.75, db: -16},
  {f: 'whoosh', at: 32.45, db: -16},
  {f: 'stamp', at: 39.77, db: -6},
  {f: 'sting', at: 40.0, db: -3},
  {f: 'chug', at: 41.8, db: -14},
  {f: 'steam_burst', at: 44.0, db: -14},
];

const Sound: React.FC = () => (
  <>
    {SFX.map((c, i) => (
      <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={c.dur ? Math.round(c.dur * FPS) : undefined} layout="none">
        <Audio src={staticFile(`audio/${c.f}.wav`)} volume={Math.pow(10, c.db / 20)} />
      </Sequence>
    ))}
  </>
);

// ---------------------------------------------------------------- composition
const SHOTS: [number, number, React.FC][] = [
  [0, 1.8, ShotHook],
  [1.8, 5.5, ShotRoute],
  [5.5, 7.5, ShotArrival],
  [7.5, 10.5, ShotBreakfastA],
  [10.5, 13.5, ShotBreakfastB],
  [13.5, 15.0, ShotSpice],
  [15.0, 21.0, ShotLunch],
  [21.0, 24.5, ShotGuests],
  [24.5, 31.0, ShotDinner],
  [31.0, 39.5, ShotFact],
  [39.5, 44.0, ShotCliff],
  [44.0, 46.0, ShotLoop],
];
export const DURATION_S = 46;

export const Ep001: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Fonts />
    {SHOTS.map(([a, b, C], i) => (
      <Sequence key={i} from={sec(a)} durationInFrames={sec(b) - sec(a)}>
        <C />
      </Sequence>
    ))}
    <Captions cues={CUES} />
    <Sound />
  </AbsoluteFill>
);
