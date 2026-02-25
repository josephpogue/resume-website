'use client'

interface ProfileModeToggleProps {
  careerMode: boolean
  toggle: () => void
}

export function ProfileModeToggle({ careerMode, toggle }: ProfileModeToggleProps) {
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-xs font-mono transition-colors"
      title={careerMode ? 'Switch to Player (Valorant) theme' : 'Switch to Career (professional) theme'}
    >
      <span className={careerMode ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}>CAREER</span>
      <div
        className={`relative w-8 h-4 rounded-full transition-colors ${
          careerMode ? 'bg-[var(--border)]' : 'bg-[var(--accent)]'
        }`}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
            careerMode ? 'translate-x-0.5' : 'translate-x-4'
          }`}
        />
      </div>
      <span className={careerMode ? 'text-[var(--muted)]' : 'text-[var(--accent)]'}>PLAYER</span>
    </button>
  )
}
