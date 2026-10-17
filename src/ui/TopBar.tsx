// Thanh trên cùng: giờ, thanh Tỉnh táo, nút Huyết tự (luôn hiện), cài đặt.
import { useState } from 'react';
import type { Settings, Speed } from './save.ts';
import { strings } from './strings.ts';

type Props = {
  /** null khi nhắm mắt (G24). */
  time: string | null;
  sanity: number;
  bloodtextAvailable: boolean;
  onOpenBloodtext: () => void;
  settings: Settings;
  onSettings: (s: Settings) => void;
  reducedMotion: boolean;
  /** G34: chọn màn để chơi thẳng. */
  levels: { id: string; title: string }[];
  currentLevel: string;
  onSelectLevel: (id: string) => void;
  /** G52: về màn hình tiêu đề. */
  onTitle: () => void;
};

export function SanityBar({ value }: { value: number }) {
  return (
    <div className="sanity" role="meter" aria-valuemin={0} aria-valuemax={5} aria-valuenow={value} aria-label={strings.sanityLabel(value)}>
      <span className="sanity-label">{strings.sanity}</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`notch${n <= value ? ' on' : ''}`} />
      ))}
      {/* G54: luôn hiện số, kể cả ở 360px. */}
      <span className="sanity-value" aria-hidden="true">
        {value}/5
      </span>
    </div>
  );
}

export function TopBar(props: Props) {
  const [open, setOpen] = useState(false);
  return (
    <header className="topbar">
      {props.time !== null && (
        <span className="time" aria-label={strings.timeLabel(props.time)}>
          {props.time}
        </span>
      )}
      <SanityBar value={props.sanity} />
      <button
        type="button"
        className="btn btn-blood"
        aria-disabled={!props.bloodtextAvailable}
        title={props.bloodtextAvailable ? undefined : strings.bloodtextLocked}
        onClick={() => props.bloodtextAvailable && props.onOpenBloodtext()}
      >
        {strings.bloodtext}
      </button>
      <div className="settings">
        <button type="button" className="btn btn-icon" aria-expanded={open} aria-label={strings.settings} onClick={() => setOpen(!open)}>
          ⚙
        </button>
        {open && (
          <div className="settings-pop">
            <label>
              {strings.textSpeed}
              <select
                value={props.settings.speed}
                onChange={(e) => props.onSettings({ ...props.settings, speed: e.target.value as Speed })}
              >
                {(Object.keys(strings.speeds) as Speed[]).map((s) => (
                  <option key={s} value={s}>
                    {strings.speeds[s]}
                  </option>
                ))}
              </select>
            </label>
            {props.reducedMotion && <p className="hint">{strings.reducedMotionNote}</p>}
            <label>
              {strings.chooseLevel}
              <select
                value={props.currentLevel}
                onChange={(e) => {
                  setOpen(false);
                  props.onSelectLevel(e.target.value);
                }}
              >
                {props.levels.map((l) => (
                  <option key={l.id} value={l.id}>
                    {strings.levelLabel(Number(l.id.slice(1)), l.title)}
                  </option>
                ))}
              </select>
            </label>
            <p className="hint">{strings.chooseLevelNote}</p>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setOpen(false);
                props.onTitle();
              }}
            >
              {strings.backToTitle}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
