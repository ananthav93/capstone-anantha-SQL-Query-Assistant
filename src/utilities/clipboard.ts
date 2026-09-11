export type ClipboardResult = 'copied' | 'failed';

export async function copyText(text: string): Promise<ClipboardResult> {
  if (!navigator.clipboard?.writeText) {
    return 'failed';
  }

  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
