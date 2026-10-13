'use client';

import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from 'react';
import { setConsultationStatusById } from '@/app/admin/actions';

export type ConsultationStatus = 'pending' | 'handled';

interface StatusCtx {
  status: ConsultationStatus;
  pending: boolean;
  toggle: () => void;
}

const Ctx = createContext<StatusCtx | null>(null);

/**
 * Provides optimistic status state for a single consultation. The toggle flips
 * the displayed status immediately and persists it in the background — needed
 * because the public Blob store is eventually consistent, so re-reading right
 * after a write returns stale data (the toggle would otherwise need a refresh
 * or a second click to appear).
 */
export function StatusProvider({
  id,
  initial,
  children,
}: {
  id: string;
  initial: ConsultationStatus;
  children: ReactNode;
}): JSX.Element {
  const [status, setStatus] = useState<ConsultationStatus>(initial);
  const [pending, startTransition] = useTransition();

  const toggle = (): void => {
    const prev = status;
    const next: ConsultationStatus = prev === 'pending' ? 'handled' : 'pending';
    setStatus(next); // optimistic
    startTransition(async () => {
      try {
        await setConsultationStatusById(id, next);
      } catch {
        setStatus(prev); // revert if the write failed
      }
    });
  };

  return <Ctx.Provider value={{ status, pending, toggle }}>{children}</Ctx.Provider>;
}

function useStatus(): StatusCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStatus must be used within a StatusProvider');
  return c;
}

export function StatusBadge({ size = 'sm' }: { size?: 'sm' | 'md' }): JSX.Element {
  const { status } = useStatus();
  const pad = size === 'md' ? 'px-3 py-1' : 'px-2.5 py-0.5';
  if (status === 'handled') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-ink-100 ${pad} text-xs font-semibold text-ink-700`}
      >
        처리완료
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#D14F3A]/10 ${pad} text-xs font-semibold text-[#D14F3A]`}
    >
      미처리
    </span>
  );
}

export function ToggleButton({
  className,
  variant = 'list',
}: {
  className?: string;
  variant?: 'list' | 'detail';
}): JSX.Element {
  const { status, pending, toggle } = useStatus();
  const label =
    variant === 'detail'
      ? status === 'pending'
        ? '처리 완료로 변경'
        : '미처리로 변경'
      : status === 'pending'
        ? '처리 완료'
        : '미처리로';
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`${className ?? ''} ${pending ? 'opacity-60' : ''}`}
    >
      {label}
    </button>
  );
}
