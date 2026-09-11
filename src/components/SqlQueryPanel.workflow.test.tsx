import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SqlQueryPanel } from './SqlQueryPanel';

describe('SqlQueryPanel selected state', () => {
  it('preserves multiline SQL exactly', () => {
    const query = 'SELECT region, SUM(total_amount)\nFROM orders\nGROUP BY region;';
    render(<SqlQueryPanel query={query} />);

    expect(screen.getByTestId('query-code').textContent).toBe(query);
  });
});
