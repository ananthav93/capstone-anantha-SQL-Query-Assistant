import { ChevronDown } from 'lucide-react';

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
      <div className="select-wrap">
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
        <ChevronDown className="select-icon" aria-hidden="true" size={17} strokeWidth={2} />
      </div>
    </div>
  );
}
