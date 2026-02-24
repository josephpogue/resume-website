'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 clip-corner-sm',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // sizes
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'md' && 'px-4 py-2 text-sm',
          size === 'lg' && 'px-6 py-3 text-base',
          // variants
          variant === 'primary' && [
            'bg-[var(--accent)] text-white hover:brightness-110',
            'focus:ring-[var(--accent)]',
          ],
          variant === 'outline' && [
            'border border-[var(--accent)] text-[var(--accent)] bg-transparent',
            'hover:bg-[var(--accent)] hover:text-white',
            'focus:ring-[var(--accent)]',
          ],
          variant === 'ghost' && [
            'bg-transparent text-[var(--text)] hover:bg-[var(--surface)]',
            'border border-[var(--border)]',
            'focus:ring-[var(--border)]',
          ],
          variant === 'danger' && [
            'bg-red-700 text-white hover:bg-red-600',
            'focus:ring-red-700',
          ],
          className,
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
