import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SqlQueryPanel } from './SqlQueryPanel';

describe('SqlQueryPanel', () => {
  it('shows an empty state when no query is selected', () => {
    render(<SqlQueryPanel query={null} />);

    expect(screen.getByTestId('query-panel')).toHaveTextContent(/select a business question/i);
  });
});
