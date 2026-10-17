import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { Asset, Level } from '../content/types.ts';
import {
  bloodtextPanel,
  campaignSummary,
  endingView,
  highlightOptions,
  initialState,
  step,
  view,
  type Action,
  type GameState,
} from '../engine/index.ts';
import { BloodtextPanel } from './BloodtextPanel.tsx';
import { loadContent } from './content.ts';
import { DeathScreen, ResultScreen } from './EndingScreens.tsx';
import { FinaleScreens, type FinaleStage } from './FinaleScreens.tsx';
import { HighlightPanel } from './HighlightPanel.tsx';
import { useReducedMotion } from './hooks.ts';
import { loadSave, usableState, writeSave, type Settings, type Speed } from './save.ts';
import { SceneLayer } from './SceneLayer.tsx';
import { strings } from './strings.ts';
import { theme } from './theme.ts';
import { TitleScreen } from './TitleScreen.tsx';
import { TopBar } from './TopBar.tsx';
import { Typewriter } from './Typewriter.tsx';

const content = loadContent();

const MS_PER_CHAR: Record<Speed, number> = { slow: 55, normal: 28, fast: 12, instant: 0 };

const themeVars = Object.fromEntries(Object.entries(theme).map(([k, v]) => [`--c-${k}`, v])) as CSSProperties;

export function App() {
  if (!content.ok) {
    return (
      <main className="app" style={themeVars}>
        <section className="text-panel">
          <h1>{strings.loadError}</h1>
          <pre className="errors">{content.errors.join('\n')}</pre>
        </section>
      </main>
    );
  }
  return <Game levels={content.levels} assets={content.assets} />;
}

function startState(levels: Level[], saved: GameState | null): GameState {
  const level = levels.find((l) => l.level === saved?.level);
  const state = level ? usableState(saved, level) : null;
  if (level && state) {
    try {
      view(level, state);
      return state;
    } catch {
      // Bản lưu không còn khớp nội dung: bắt đầu lại.
    }
  }
  return initialState(levels[0]!);
}

/** G53: `?dev=1` mở mọi màn trong bảng chọn màn. */
function devMode(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('dev') === '1';
  } catch {
    return false;
  }
}

type Screen = 'title' | 'play' | FinaleStage;

function Game({ levels, assets }: { levels: Level[]; assets: Map<string, Asset> }) {
  const reducedMotion = useReducedMotion();
  const [game, setGame] = useState(() => {
    const save = loadSave();
    return {
      state: startState(levels, save.state),
      settings: save.settings,
      entry: 0,
      lastMarks: save.lastMarks,
      /** Có tiến trình để "Chơi tiếp" (G52). */
      hasProgress: save.state !== null,
    };
  });
  const [screen, setScreen] = useState<Screen>('title');
  const [dev] = useState(devMode);
  const [panelOpen, setPanelOpen] = useState(false);
  const { state, settings, lastMarks } = game;
  const levelOf = useCallback((s: GameState) => levels.find((l) => l.level === s.level)!, [levels]);
  const level = levelOf(state);
  const nextLevel = levels[levels.indexOf(level) + 1];

  useEffect(() => {
    if (game.hasProgress) writeSave({ version: 2, state, settings, lastMarks });
  }, [game.hasProgress, state, settings, lastMarks]);

  const dispatch = useCallback(
    (action: Action) =>
      setGame((g) => ({
        ...g,
        state: step(levelOf(g.state), g.state, action),
        lastMarks: action.type === 'highlight' ? { level: g.state.level, ids: action.ids } : g.lastMarks,
        // Đánh dấu từ khoá không đổi node nên không gõ lại chữ.
        entry: action.type === 'highlight' ? g.entry : g.entry + 1,
      })),
    [levelOf],
  );
  const setSettings = (s: Settings) => setGame((g) => ({ ...g, settings: s }));
  const closePanel = useCallback(() => setPanelOpen(false), []);

  /** Bắt đầu một màn từ đầu, mang theo hồ sơ và số liệu chuyến chơi (G33, G34, G51). */
  const startLevel = (target: Level) => {
    setPanelOpen(false);
    setScreen('play');
    setGame((g) => ({
      ...g,
      state: initialState(target, { unlocked: g.state.unlocked, campaign: g.state.campaign }),
      entry: g.entry + 1,
    }));
  };
  const selectLevel = (id: string) => {
    const target = levels.find((l) => l.level === id);
    if (target) startLevel(target);
  };
  const newGame = () => {
    setScreen('play');
    setGame((g) => ({ ...g, state: initialState(levels[0]!), lastMarks: null, hasProgress: true, entry: g.entry + 1 }));
  };

  if (screen === 'title') {
    return (
      <main className="app" style={themeVars}>
        <TitleScreen
          canContinue={game.hasProgress}
          onContinue={() => setScreen('play')}
          onNewGame={newGame}
          settings={settings}
          onSettings={setSettings}
          reducedMotion={reducedMotion}
        />
      </main>
    );
  }

  const v = view(level, state);
  const ending = endingView(level, state);
  if (screen !== 'play' && ending) {
    const order: FinaleStage[] = ['epilogue', 'summary', 'credits'];
    return (
      <main className="app" style={themeVars}>
        <FinaleScreens
          stage={screen}
          epilogue={ending.epilogue}
          summary={campaignSummary(levels, state.campaign)}
          onNext={() => setScreen(order[order.indexOf(screen) + 1] ?? 'credits')}
          onReplayFromStart={() => startLevel(levels[0]!)}
          onTitle={() => setScreen('title')}
        />
      </main>
    );
  }

  const msPerChar = reducedMotion ? 0 : MS_PER_CHAR[settings.speed];
  const replay = () => dispatch({ type: 'restart' });
  // G51: không có đoạn kết thì vào thẳng tổng kết.
  const finale = () => setScreen(ending?.epilogue.length ? 'epilogue' : 'summary');
  const selectable = dev ? levels : levels.filter((l) => state.campaign.reached.includes(l.level));

  let footer: ReactNode;
  if (v.phase === 'highlight') {
    footer = (
      <HighlightPanel
        options={highlightOptions(level)}
        initial={lastMarks?.level === level.level ? lastMarks.ids : []}
        onDone={(ids) => dispatch({ type: 'highlight', ids })}
      />
    );
  } else if (ending) {
    footer =
      ending.result === 'death' ? (
        <DeathScreen ending={ending} onReplay={replay} />
      ) : (
        <ResultScreen
          ending={ending}
          onReplay={replay}
          onNext={nextLevel ? () => startLevel(nextLevel) : undefined}
          onFinale={finale}
        />
      );
  } else {
    footer = (
      <>
        {v.notices.map((n, i) => (
          <p key={i} className="ch ch-system notice">
            {strings.sanityNotice(n.delta)}
          </p>
        ))}
        {v.actionsLeft !== null && <p className="ch ch-system actions-left">{strings.actionsLeft(v.actionsLeft)}</p>}
        <nav className="exits">
          {v.exit.kind === 'choices' &&
            v.exit.choices.map((c) => (
              <button key={c.index} type="button" className="btn choice" onClick={() => dispatch({ type: 'choose', index: c.index })}>
                {c.text}
              </button>
            ))}
          {v.exit.kind === 'continue' && (
            <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'continue' })} autoFocus>
              {strings.continue}
            </button>
          )}
        </nav>
      </>
    );
  }

  return (
    <main className="app" style={themeVars}>
      <TopBar
        time={v.time}
        sanity={v.sanity}
        bloodtextAvailable={v.bloodtextAvailable}
        onOpenBloodtext={() => setPanelOpen(true)}
        settings={settings}
        onSettings={setSettings}
        reducedMotion={reducedMotion}
        levels={selectable.map((l) => ({ id: l.level, title: l.title }))}
        currentLevel={level.level}
        onSelectLevel={selectLevel}
        onTitle={() => setScreen('title')}
      />
      <SceneLayer scene={v.scene} assets={assets} />
      <section className="text-panel">
        <Typewriter key={`${game.entry}:${state.node}`} lines={v.lines} msPerChar={msPerChar} footer={footer} />
      </section>
      {panelOpen && <BloodtextPanel lines={bloodtextPanel(level, state)} onClose={closePanel} />}
    </main>
  );
}
