import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QueryExplanationPanel } from './QueryExplanationPanel';

describe('QueryExplanationPanel', () => {
  it('shows an empty state when no explanation is selected', () => {
    render(<QueryExplanationPanel explanation={null} />);

    expect(screen.getByTestId('explanation-panel')).toHaveTextContent(/select a business question/i);
  });

  it('renders the selected explanation in plain language', () => {
    render(<QueryExplanationPanel explanation="Groups revenue by region." />);

    expect(screen.getByTestId('explanation-panel')).toHaveTextContent('Groups revenue by region.');
  });
});
