import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'cyan' | 'muted'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]',
        variant === 'accent' && 'bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)]',
        variant === 'cyan' && 'bg-[var(--accent2)]/10 border border-[var(--accent2)]/30 text-[var(--accent2)]',
        variant === 'muted' && 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]',
        className,
      )}
    >
      {children}
    </span>
  )
}
