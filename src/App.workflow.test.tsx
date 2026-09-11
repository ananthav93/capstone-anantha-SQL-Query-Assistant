import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

describe('SQL Query Assistant workflow', () => {
  it('shows the matching SQL and explanation for every catalog selection', async () => {
    const user = userEvent.setup();
    render(<App />);
    const selector = screen.getByRole('combobox', { name: /business question/i });

    await user.selectOptions(selector, 'sales-by-region');
    expect(screen.getByTestId('query-panel')).toHaveTextContent('SUM(o.total_amount)');
    expect(screen.getByTestId('explanation-panel')).toHaveTextContent(/joins each order to its customer/i);

    await user.selectOptions(selector, 'below-reorder-point');
    expect(screen.getByTestId('query-panel')).toHaveTextContent('stock_quantity < reorder_point');
    expect(screen.getByTestId('explanation-panel')).toHaveTextContent(/reorder point/i);
    expect(screen.getByTestId('query-panel')).not.toHaveTextContent('SUM(o.total_amount)');
  });

  it('copies the selected query and exposes polite success feedback', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<App />);

    await user.selectOptions(screen.getByRole('combobox', { name: /business question/i }), 'sales-by-region');
    await user.click(screen.getByRole('button', { name: /copy query/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('SUM(o.total_amount)'));
    expect(await screen.findByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status')).toHaveTextContent(/copied/i);
  });

  it('keeps the query and shows failure feedback when clipboard access fails', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<App />);

    await user.selectOptions(screen.getByRole('combobox', { name: /business question/i }), 'monthly-revenue');
    await user.click(screen.getByRole('button', { name: /copy query/i }));

    expect(screen.getByTestId('query-panel')).toHaveTextContent("DATE_TRUNC('month'");
    expect(await screen.findByRole('status')).toHaveTextContent(/could not copy/i);
  });

  it('prevents a second clipboard write while the first one is pending', async () => {
    const user = userEvent.setup();
    let resolveCopy: (() => void) | undefined;
    const writeText = vi.fn().mockImplementation(() => new Promise<void>((resolve) => {
      resolveCopy = resolve;
    }));
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<App />);

    await user.selectOptions(screen.getByRole('combobox', { name: /business question/i }), 'top-customers');
    const copyButton = screen.getByRole('button', { name: /copy query/i });
    await user.click(copyButton);
    expect(copyButton).toBeDisabled();
    expect(writeText).toHaveBeenCalledOnce();

    resolveCopy?.();
  });
});
