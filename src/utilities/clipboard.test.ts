import { beforeEach, describe, expect, it, vi } from 'vitest';
import { copyText } from './clipboard';

describe('copyText', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn() },
    });
  });

  it('returns copied when the browser accepts the exact text', async () => {
    const writeText = vi.mocked(navigator.clipboard.writeText);
    writeText.mockResolvedValue(undefined);

    await expect(copyText('SELECT *\nFROM orders;')).resolves.toBe('copied');
    expect(writeText).toHaveBeenCalledWith('SELECT *\nFROM orders;');
  });

  it('returns failed when clipboard access is rejected', async () => {
    const writeText = vi.mocked(navigator.clipboard.writeText);
    writeText.mockRejectedValue(new Error('Permission denied'));

    await expect(copyText('SELECT 1;')).resolves.toBe('failed');
  });

  it('returns failed when the browser has no clipboard API', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });

    await expect(copyText('SELECT 1;')).resolves.toBe('failed');
  });
});
