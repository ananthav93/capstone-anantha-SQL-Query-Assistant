import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CopyQueryButton } from './CopyQueryButton';

describe('CopyQueryButton', () => {
  it('has an accessible name and calls its action from the keyboard', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CopyQueryButton disabled={false} onClick={onClick} />);

    const button = screen.getByRole('button', { name: /copy query/i });
    await user.tab();
    await user.keyboard('{Enter}');

    expect(button).toHaveFocus();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is unavailable while copy is pending', () => {
    render(<CopyQueryButton disabled status="copying" onClick={() => undefined} />);

    expect(screen.getByRole('button', { name: /copy query/i })).toBeDisabled();
    expect(screen.getByText(/copying/i)).toBeInTheDocument();
  });
});
