interface SqlQueryPanelProps {
  query: string | null;
}

export function SqlQueryPanel({ query }: SqlQueryPanelProps) {
  return (
    <section className="content-panel query-panel" data-testid="query-panel" aria-labelledby="query-panel-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Output 01</p>
          <h2 id="query-panel-title">Sample SQL</h2>
        </div>
        <span className="panel-badge">PostgreSQL</span>
      </div>
      {query ? (
        <pre className="sql-output"><code data-testid="query-code">{query}</code></pre>
      ) : (
        <div className="empty-panel-state">
          <span className="empty-state-mark">01</span>
          <p>Select a business question to reveal its query.</p>
        </div>
      )}
    </section>
  );
}
