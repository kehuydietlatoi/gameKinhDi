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

export function ResultScreen({ ending, onReplay }: { ending: EndingView; onReplay: () => void }) {
  return (
    <section className="ending survive">
      <h2>{ending.cause}</h2>
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
      <button type="button" className="btn btn-primary" onClick={onReplay} autoFocus>
        {strings.replay}
      </button>
    </section>
  );
}
