// Màn hình chết (đặc tả 4.5) và màn hình kết quả (4.7).
import type { EndingView } from '../engine/index.ts';
import { BloodLines } from './channels/Bloodtext.tsx';
import { strings } from './strings.ts';

export function DeathScreen({ ending, onReplay }: { ending: EndingView; onReplay: () => void }) {
  return (
    <section className="ending death">
      <h2>
        {strings.death} · {ending.cause}
      </h2>
      <BloodLines lines={ending.solution} />
      <p className="reveal">
        <span className="ch-prefix">{strings.reveal} · </span>
        {ending.reveal}
      </p>
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
  onRestartGame?: (() => void) | undefined;
};

/**
 * Kết cục sống: ghi rõ kết cục nào (G28), cụm sinh lộ, từ khoá, hồ sơ; sang màn kế (G33).
 * Ở màn cuối (G41): kết cục trọn vẹn là hết game; kết thúc mở thì mời chơi lại màn cuối.
 */
export function ResultScreen({ ending, onReplay, onNext, onRestartGame }: ResultProps) {
  return (
    <section className="ending survive">
      {ending.finale === 'complete' && <p className="finale">{strings.gameComplete}</p>}
      {ending.finale === 'open' && <p className="finale">{strings.openEnding}</p>}
      <h2>{ending.cause}</h2>
      <BloodLines lines={ending.solution} />
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
      {ending.dossiers.length > 0 && (
        <>
          <h3>{strings.dossiersTitle}</h3>
          <ul>
            {ending.dossiers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </>
      )}
      <div className="row">
        {onNext && (
          <button type="button" className="btn btn-primary" onClick={onNext} autoFocus>
            {strings.nextLevel}
          </button>
        )}
        {ending.finale === 'complete' && onRestartGame && (
          <button type="button" className="btn btn-primary" onClick={onRestartGame} autoFocus>
            {strings.replayFromStart}
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
