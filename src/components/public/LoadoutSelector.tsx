'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Loadout } from '@/types'

interface Props {
  loadouts: Loadout[]
  activeSlug: string
}

export function LoadoutSelector({ loadouts, activeSlug }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('loadout', e.target.value)
    router.push(`/resume?${params.toString()}`)
  }

  if (loadouts.length <= 1) return null

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Loadout:</span>
      <select
        value={activeSlug}
        onChange={handleChange}
        className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm px-3 py-1.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
      >
        {loadouts.map(l => (
          <option key={l.id} value={l.slug}>{l.name}</option>
        ))}
      </select>
    </div>
  )
}
