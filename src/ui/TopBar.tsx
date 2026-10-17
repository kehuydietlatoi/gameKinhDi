// Thanh trên cùng: giờ, thanh Tỉnh táo, nút Huyết tự (luôn hiện), cài đặt.
import { useState } from 'react';
import type { Settings, Speed } from './save.ts';
import { strings } from './strings.ts';

type Props = {
  time: string;
  sanity: number;
  bloodtextAvailable: boolean;
  onOpenBloodtext: () => void;
  settings: Settings;
  onSettings: (s: Settings) => void;
  reducedMotion: boolean;
};

export function SanityBar({ value }: { value: number }) {
  return (
    <div className="sanity" role="meter" aria-valuemin={0} aria-valuemax={5} aria-valuenow={value} aria-label={strings.sanityLabel(value)}>
      <span className="sanity-label">{strings.sanity}</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`notch${n <= value ? ' on' : ''}`} />
      ))}
    </div>
  );
}

export function TopBar(props: Props) {
  const [open, setOpen] = useState(false);
  return (
    <header className="topbar">
      <span className="time" aria-label={strings.timeLabel(props.time)}>
        {props.time}
      </span>
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
          </div>
        )}
      </div>
    </header>
  );
}
