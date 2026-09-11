interface QueryExplanationPanelProps {
  explanation: string | null;
}

export function QueryExplanationPanel({ explanation }: QueryExplanationPanelProps) {
  return (
    <section className="content-panel explanation-panel" data-testid="explanation-panel" aria-labelledby="explanation-panel-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Output 02</p>
          <h2 id="explanation-panel-title">How it works</h2>
        </div>
        <span className="panel-badge panel-badge-warm">Plain language</span>
      </div>
      {explanation ? (
        <p className="explanation-copy">{explanation}</p>
      ) : (
        <div className="empty-panel-state">
          <span className="empty-state-mark">02</span>
          <p>Select a business question to see the explanation.</p>
        </div>
      )}
    </section>
  );
}
