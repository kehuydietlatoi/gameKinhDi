// Màn hình chết (đặc tả 4.5) và màn hình kết quả (4.7).
import type { EndingView } from '../engine/index.ts';
import { BloodLines } from './channels/Bloodtext.tsx';
import { strings } from './strings.ts';

export function DeathScreen({ ending, onReplay }: { ending: EndingView; onReplay: () => void }) {
  return (
    <section className="ending death">
      <p className="death-title">{strings.death}</p>
      <h2>{ending.cause}</h2>
      {ending.misread.length > 0 && (
        <>
          <h3>{strings.misreadTitle}</h3>
          <div className="misread">
            <BloodLines lines={ending.misread} labels={ending.labels} />
          </div>
          <h3>{strings.trueBloodtextTitle}</h3>
        </>
      )}
      <BloodLines lines={ending.solution} labels={ending.labels} violated={ending.violates} />
      {ending.revealHidden ? (
        <p className="hint">{strings.revealLater}</p>
      ) : (
        <p className="reveal">
          <span className="ch-prefix">{strings.reveal} · </span>
          {ending.reveal}
        </p>
      )}
      <button type="button" className="btn btn-primary" onClick={onReplay} autoFocus>
        {strings.replay}
      </button>
    </section>
  );
}

type ResultProps = {
  ending: EndingView;
  onReplay: () => void;
  onNext?: (() => void) | undefined;
  /** G51: kết cục trọn vẹn của màn cuối đi tiếp sang đoạn kết và tổng kết. */
  onFinale?: (() => void) | undefined;
};

/**
 * Kết cục sống: ghi rõ kết cục nào (G28), cụm sinh lộ, từ khoá; sang màn kế (G33).
 * Hồ sơ chỉ là cờ ẩn, không hiển thị (G56).
 * Ở màn cuối (G41): kết cục trọn vẹn đi tiếp sang đoạn kết (G51); kết thúc mở thì mời chơi lại màn cuối.
 */
export function ResultScreen({ ending, onReplay, onNext, onFinale }: ResultProps) {
  return (
    <section className="ending survive">
      {ending.finale === 'complete' && <p className="finale">{strings.gameComplete}</p>}
      {ending.finale === 'open' && <p className="finale">{strings.openEnding}</p>}
      <h2>{ending.cause}</h2>
      <BloodLines lines={ending.solution} labels={ending.labels} />
      <p className="reveal">
        <span className="ch-prefix">{strings.reveal} · </span>
        {ending.reveal}
      </p>
      <h3>{strings.keywordsTitle}</h3>
      {ending.keywords.length ? (
        <ul className="kw-results">
          {ending.keywords.map((k) => (
            <li key={k.id} className={k.correct ? 'ok' : 'bad'}>
              “{k.text}” — {k.correct ? strings.keywordCorrect : strings.keywordWrong}
            </li>
          ))}
        </ul>
      ) : (
        <p className="hint">{strings.keywordsNone}</p>
      )}
      <div className="row">
        {onNext && (
          <button type="button" className="btn btn-primary" onClick={onNext} autoFocus>
            {strings.nextLevel}
          </button>
        )}
        {ending.finale === 'complete' && onFinale && (
          <button type="button" className="btn btn-primary" onClick={onFinale} autoFocus>
            {strings.continue}
          </button>
        )}
        <button
          type="button"
          className={onNext || ending.finale === 'complete' ? 'btn' : 'btn btn-primary'}
          onClick={onReplay}
          autoFocus={!onNext && ending.finale !== 'complete'}
        >
          {ending.finale === 'none' ? strings.replay : strings.replayLevel}
        </button>
      </div>
    </section>
  );
}
