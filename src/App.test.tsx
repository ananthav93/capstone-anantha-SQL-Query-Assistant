import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('SQL Query Assistant shell', () => {
  it('renders the single-screen shell and initial empty state', () => {
    render(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sql query assistant/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /business question/i })).toBeInTheDocument();
    expect(screen.getByTestId('query-panel')).toHaveTextContent(/select a business question/i);
    expect(screen.getByTestId('explanation-panel')).toHaveTextContent(/select a business question/i);
    expect(screen.getByRole('button', { name: /copy query/i })).toBeDisabled();
  });
});
