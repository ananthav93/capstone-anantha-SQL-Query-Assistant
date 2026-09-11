import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, DatabaseZap } from 'lucide-react';
import { BusinessQuestionSelector } from './components/BusinessQuestionSelector';
import { CopyQueryButton } from './components/CopyQueryButton';
import { QueryExplanationPanel } from './components/QueryExplanationPanel';
import { SqlQueryPanel } from './components/SqlQueryPanel';
import { businessQuestions } from './data/businessQuestions';
import type { CopyStatus } from './domain/copyStatus';
import { StaticQuestionRepository } from './repositories/staticQuestionRepository';
import { copyText } from './utilities/clipboard';

const questionRepository = new StaticQuestionRepository(businessQuestions);

export default function App() {
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const copyRequestVersion = useRef(0);
  const selectedQuestion = selectedQuestionId
    ? questionRepository.getQuestionById(selectedQuestionId)
    : undefined;

  useEffect(() => {
    if (copyStatus !== 'copied' && copyStatus !== 'failed') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopyStatus('idle'), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [copyStatus]);

  const handleQuestionChange = (questionId: string) => {
    copyRequestVersion.current += 1;
    setSelectedQuestionId(questionId);
    setCopyStatus('idle');
  };

  const handleCopy = async () => {
    if (!selectedQuestion || copyStatus === 'copying') {
      return;
    }

    const requestVersion = copyRequestVersion.current;
    setCopyStatus('copying');
    const result = await copyText(selectedQuestion.sql);

    if (requestVersion === copyRequestVersion.current) {
      setCopyStatus(result);
    }
  };

  const copyMessage = copyStatus === 'copied'
    ? 'Query copied to clipboard.'
    : copyStatus === 'failed'
      ? 'Could not copy the query. Try again.'
      : '';

  return (
    <div className="app-shell">
      <header className="site-header" role="banner">
        <div className="brand-lockup">
          <div className="brand-icon" aria-hidden="true">
            <DatabaseZap size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p className="brand-kicker">SQL / FIELD GUIDE</p>
            <h1>SQL Query Assistant</h1>
          </div>
        </div>
        <div className="header-note">
          <span className="status-dot" aria-hidden="true" />
          <span>Static examples only</span>
        </div>
      </header>

      <main>
        <section className="intro-grid" aria-labelledby="intro-title">
          <div className="intro-copy">
            <p className="eyebrow">Make the question legible</p>
            <h2 id="intro-title">Turn a business question into a query you can explain.</h2>
            <p className="intro-description">
              Choose a familiar question to see a carefully written SQL example and the reasoning behind it.
            </p>
          </div>
          <div className="intro-accent" aria-hidden="true">
            <ArrowDownRight size={34} strokeWidth={1.5} />
            <span>Pick a prompt<br />to begin</span>
          </div>
        </section>

        <section className="question-bar" aria-label="Question controls">
          <BusinessQuestionSelector
            questions={questionRepository.getAllQuestions()}
            selectedQuestionId={selectedQuestionId}
            onChange={handleQuestionChange}
          />
          <CopyQueryButton
            disabled={!selectedQuestion || copyStatus === 'copying'}
            status={copyStatus}
            onClick={handleCopy}
          />
          {copyMessage ? (
            <p className={`copy-status copy-status-${copyStatus}`} role="status" aria-live="polite" data-testid="copy-status">
              {copyMessage}
            </p>
          ) : null}
        </section>

        <section className="output-grid" aria-label="Query outputs">
          <SqlQueryPanel query={selectedQuestion?.sql ?? null} />
          <QueryExplanationPanel explanation={selectedQuestion?.explanation ?? null} />
        </section>
      </main>

      <footer className="site-footer">
        <span>Built for quick understanding.</span>
        <span>Queries are examples, never executed.</span>
      </footer>
    </div>
  );
}
