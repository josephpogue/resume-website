import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// JSON array serialization helpers for SQLite
export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function stringifyArray(arr: string[]): string {
  return JSON.stringify(arr)
}

// Format date string "YYYY-MM" → "Month YYYY" or "Present"
export function formatDate(date: string | null | undefined): string {
  if (!date) return 'Present'
  const [year, month] = date.split('-')
  if (!month) return year
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`
}

export function formatDateRange(start: string, end: string | null): string {
  return `${formatDate(start)} – ${formatDate(end)}`
}
