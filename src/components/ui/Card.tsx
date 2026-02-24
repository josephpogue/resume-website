import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  accent?: boolean
}

export function Card({ children, className, hover = false, accent = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--surface)] border border-[var(--border)] p-4',
        'clip-corner',
        hover && 'transition-all duration-200 hover:border-[var(--accent)]/50 hover:bg-[var(--surface)]/80 cursor-pointer',
        accent && 'border-l-2 border-l-[var(--accent)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
