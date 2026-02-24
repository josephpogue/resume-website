'use client'

import { useRecruiterMode } from '@/hooks/useRecruiterMode'

export function RecruiterModeToggle() {
  const { enabled, toggle } = useRecruiterMode()

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-xs font-mono transition-colors"
      title={enabled ? 'Switch to Valorant theme' : 'Switch to Recruiter (clean) theme'}
    >
      <span className={enabled ? 'text-[var(--muted)]' : 'text-[var(--accent)]'}>VAL</span>
      <div
        className={`relative w-8 h-4 rounded-full transition-colors ${
          enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
        }`}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </div>
      <span className={enabled ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}>REC</span>
    </button>
  )
}
