export interface QuestionOption {
  id: string;
  label: string;
}

interface BusinessQuestionSelectorProps {
  questions: readonly QuestionOption[];
  selectedQuestionId: string;
  onChange: (questionId: string) => void;
}

export function BusinessQuestionSelector({
  questions,
  selectedQuestionId,
  onChange,
}: BusinessQuestionSelectorProps) {
  return (
    <div className="selector-field">
      <label htmlFor="business-question">Business question</label>
      <select
        id="business-question"
        aria-label="Business question"
        data-testid="business-question-selector"
        value={selectedQuestionId}
        onChange={(event) => onChange(event.target.value)}
        disabled={questions.length === 0}
      >
        <option value="">Choose a business question...</option>
        {questions.map((question) => (
          <option key={question.id} value={question.id}>
            {question.label}
          </option>
        ))}
      </select>
    </div>
  );
}
