import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BusinessQuestionSelector } from './BusinessQuestionSelector';

const questions = [
  { id: 'sales-by-region', label: 'What is total revenue by region?' },
  { id: 'monthly-revenue', label: 'How has revenue changed by month?' },
];

describe('BusinessQuestionSelector', () => {
  it('exposes a labeled selector with an empty option before catalog wiring', () => {
    render(
      <BusinessQuestionSelector
        questions={[]}
        selectedQuestionId=""
        onChange={() => undefined}
      />,
    );

    const selector = screen.getByRole('combobox', { name: /business question/i });
    expect(selector).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /choose a business question/i })).toBeInTheDocument();
  });

  it('supports keyboard selection and reports the selected ID', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <BusinessQuestionSelector
        questions={questions}
        selectedQuestionId=""
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByRole('combobox', { name: /business question/i }), 'monthly-revenue');

    expect(onChange).toHaveBeenCalledWith('monthly-revenue');
  });
});
