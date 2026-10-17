import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { Asset, Level } from '../content/types.ts';
import {
  bloodtextPanel,
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
import { HighlightPanel } from './HighlightPanel.tsx';
import { useReducedMotion } from './hooks.ts';
import { loadSave, usableState, writeSave, type Settings, type Speed } from './save.ts';
import { SceneLayer } from './SceneLayer.tsx';
import { strings } from './strings.ts';
import { theme } from './theme.ts';
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
  return <Game level={content.level} assets={content.assets} />;
}

function startState(level: Level, saved: GameState | null): GameState {
  const state = usableState(saved, level);
  if (state) {
    try {
      view(level, state);
      return state;
    } catch {
      // Bản lưu không còn khớp nội dung: bắt đầu lại.
    }
  }
  return initialState(level);
}

function Game({ level, assets }: { level: Level; assets: Map<string, Asset> }) {
  const reducedMotion = useReducedMotion();
  const [game, setGame] = useState(() => {
    const save = loadSave();
    return { state: startState(level, save.state), settings: save.settings, entry: 0 };
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const { state, settings } = game;

  useEffect(() => {
    writeSave({ version: 1, state, settings });
  }, [state, settings]);

  const dispatch = useCallback(
    (action: Action) =>
      setGame((g) => ({
        ...g,
        state: step(level, g.state, action),
        // Đánh dấu từ khoá không đổi node nên không gõ lại chữ.
        entry: action.type === 'highlight' ? g.entry : g.entry + 1,
      })),
    [level],
  );
  const setSettings = (s: Settings) => setGame((g) => ({ ...g, settings: s }));
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const v = view(level, state);
  const ending = endingView(level, state);
  const msPerChar = reducedMotion ? 0 : MS_PER_CHAR[settings.speed];
  const replay = () => dispatch({ type: 'restart' });

  let footer: ReactNode;
  if (v.phase === 'highlight') {
    footer = <HighlightPanel options={highlightOptions(level)} onDone={(ids) => dispatch({ type: 'highlight', ids })} />;
  } else if (ending) {
    footer =
      ending.result === 'death' ? (
        <DeathScreen ending={ending} onReplay={replay} />
      ) : (
        <ResultScreen ending={ending} onReplay={replay} />
      );
  } else {
    footer = (
      <>
        {v.notices.map((n, i) => (
          <p key={i} className="ch ch-system notice">
            {strings.sanityNotice(n.delta)}
          </p>
        ))}
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
      />
      <SceneLayer scene={v.scene} assets={assets} />
      <section className="text-panel">
        <Typewriter key={`${game.entry}:${state.node}`} lines={v.lines} msPerChar={msPerChar} footer={footer} />
      </section>
      {panelOpen && <BloodtextPanel lines={bloodtextPanel(level, state)} onClose={closePanel} />}
    </main>
  );
}
