// Sau kết cục trọn vẹn của màn cuối (G51): đoạn kết → tổng kết → credits.
import type { CampaignSummary } from '../engine/index.ts';
import { strings } from './strings.ts';

export type FinaleStage = 'epilogue' | 'summary' | 'credits';

type Props = {
  stage: FinaleStage;
  epilogue: string[];
  summary: CampaignSummary;
  onNext: () => void;
  onReplayFromStart: () => void;
  onTitle: () => void;
};

export function FinaleScreens({ stage, epilogue, summary, onNext, onReplayFromStart, onTitle }: Props) {
  if (stage === 'epilogue') {
    return (
      <section className="finale-screen epilogue">
        {epilogue.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <button type="button" className="btn btn-primary" onClick={onNext} autoFocus>
          {strings.continue}
        </button>
      </section>
    );
  }
  if (stage === 'summary') {
    return (
      <section className="finale-screen summary">
        <h2>{strings.summaryTitle}</h2>
        <dl className="summary-list">
          <dt>{strings.summaryDeaths}</dt>
          <dd>{summary.deaths}</dd>
          <dt>{strings.summaryKeywords}</dt>
          <dd>
            {summary.keywordsHit}/{summary.keywordsMarked}
          </dd>
          <dt>{strings.summaryEndings}</dt>
          <dd>
            {summary.endingsOpened}/{summary.endingsTotal}
          </dd>
        </dl>
        <button type="button" className="btn btn-primary" onClick={onNext} autoFocus>
          {strings.continue}
        </button>
      </section>
    );
  }
  return (
    <section className="finale-screen credits">
      <h2>{strings.gameTitle}</h2>
      {strings.credits.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      <p className="thanks">{strings.thanks}</p>
      <div className="row">
        <button type="button" className="btn btn-primary" onClick={onReplayFromStart} autoFocus>
          {strings.replayFromStart}
        </button>
        <button type="button" className="btn" onClick={onTitle}>
          {strings.backToTitle}
        </button>
      </div>
    </section>
  );
}
