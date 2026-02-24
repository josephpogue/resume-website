'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface EntityTableProps<T extends { id: string }> {
  items: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (id: string) => void
  loading?: boolean
  emptyMessage?: string
}

export function EntityTable<T extends { id: string }>({
  items,
  columns,
  onEdit,
  onDelete,
  loading,
  emptyMessage = 'No items yet.',
}: EntityTableProps<T>) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (deletingId === id) {
      onDelete?.(id)
      setDeletingId(null)
    } else {
      setDeletingId(id)
      // Auto-cancel confirm after 3s
      setTimeout(() => setDeletingId(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-[var(--muted)] text-sm">
        Loading...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border border-dashed border-[var(--border)] text-[var(--muted)] text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {columns.map(col => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-3 py-2 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider',
                  col.className,
                )}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-3 py-2 text-right w-24">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={item.id}
              className={cn(
                'border-b border-[var(--border)]/50 hover:bg-[var(--surface)]/50 transition-colors',
                i % 2 === 0 ? 'bg-transparent' : 'bg-[var(--surface)]/20',
              )}
            >
              {columns.map(col => (
                <td key={String(col.key)} className={cn('px-3 py-2.5 text-[var(--text)]', col.className)}>
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[String(col.key)] ?? '')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-3 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="p-1 h-auto"
                      >
                        <Edit2 size={12} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant={deletingId === item.id ? 'danger' : 'ghost'}
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="p-1 h-auto"
                        title={deletingId === item.id ? 'Click again to confirm delete' : 'Delete'}
                      >
                        <Trash2 size={12} />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
