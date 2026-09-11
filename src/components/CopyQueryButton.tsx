import { Copy } from 'lucide-react';
import type { CopyStatus } from '../domain/copyStatus';

interface CopyQueryButtonProps {
  disabled: boolean;
  status?: CopyStatus;
  onClick?: () => void;
}

export function CopyQueryButton({ disabled, status = 'idle', onClick }: CopyQueryButtonProps) {
  return (
    <button
      className="copy-button"
      type="button"
      aria-label="Copy query"
      onClick={onClick}
      disabled={disabled}
    >
      <Copy aria-hidden="true" size={17} strokeWidth={2.2} />
      <span>{status === 'copying' ? 'Copying...' : 'Copy query'}</span>
    </button>
  );
}
