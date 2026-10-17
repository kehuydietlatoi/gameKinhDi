// Màn hình tiêu đề (G52): Chơi tiếp, Chơi mới, Cài đặt. Hồ sơ không hiển thị (G56).
import { useState } from 'react';
import type { Settings, Speed } from './save.ts';
import { strings } from './strings.ts';

type Props = {
  canContinue: boolean;
  onContinue: () => void;
  onNewGame: () => void;
  settings: Settings;
  onSettings: (s: Settings) => void;
  reducedMotion: boolean;
};

export function TitleScreen({ canContinue, onContinue, onNewGame, settings, onSettings, reducedMotion }: Props) {
  // Có tiến trình thì Chơi mới cần bấm hai lần, không dùng hộp thoại của trình duyệt.
  const [confirming, setConfirming] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const newGame = () => {
    if (canContinue && !confirming) setConfirming(true);
    else onNewGame();
  };

  return (
    <section className="title-screen">
      <h1>{strings.gameTitle}</h1>
      <nav className="exits">
        {canContinue && (
          <button type="button" className="btn btn-primary" onClick={onContinue} autoFocus>
            {strings.continueGame}
          </button>
        )}
        <button type="button" className={canContinue ? 'btn' : 'btn btn-primary'} onClick={newGame} autoFocus={!canContinue}>
          {strings.newGame}
        </button>
        {confirming && <p className="hint">{strings.newGameConfirm}</p>}
        <button type="button" className="btn" aria-expanded={showSettings} onClick={() => setShowSettings(!showSettings)}>
          {strings.settings}
        </button>
      </nav>
      {showSettings && (
        <div className="title-settings">
          <label>
            {strings.textSpeed}
            <select value={settings.speed} onChange={(e) => onSettings({ ...settings, speed: e.target.value as Speed })}>
              {(Object.keys(strings.speeds) as Speed[]).map((s) => (
                <option key={s} value={s}>
                  {strings.speeds[s]}
                </option>
              ))}
            </select>
          </label>
          {reducedMotion && <p className="hint">{strings.reducedMotionNote}</p>}
        </div>
      )}
    </section>
  );
}
