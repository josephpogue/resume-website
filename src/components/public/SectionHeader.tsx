interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ label, title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-[2px] bg-[var(--accent)]" />
        <span
          className="text-[var(--accent)] tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
        >
          {label}
        </span>
      </div>
      <h2 className="text-[var(--text)]" style={{ fontSize: '1.75rem' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-[var(--muted)] mt-2" style={{ fontSize: '0.95rem' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
