'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Plus, Layers, Trash2 } from 'lucide-react'
import type { Loadout } from '@/types'

const DEFAULT_RULES = {
  minBullets: 1,
  maxBulletsPerRole: 5,
  maxProjects: 4,
  fontScaleRange: [0.92, 1.0],
  lineHeightRange: [0.92, 1.0],
}

export default function LoadoutsPage() {
  const [loadouts, setLoadouts] = useState<Loadout[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', isDefault: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/loadouts').then(r => r.json()).then(d => { setLoadouts(d); setLoading(false) })
  }, [])

  async function createLoadout(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/loadouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, exportRules: DEFAULT_RULES }),
    })
    const created = await res.json()
    setLoadouts(prev => [...prev, created])
    setForm({ name: '', slug: '', isDefault: false })
    setShowCreate(false)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (deletingId === id) {
      await fetch(`/api/loadouts/${id}`, { method: 'DELETE' })
      setLoadouts(prev => prev.filter(l => l.id !== id))
      setDeletingId(null)
    } else {
      setDeletingId(id)
      setTimeout(() => setDeletingId(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">
            <span className="neon-red">Loadouts</span>
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Targeted resume builds</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <Plus size={14} className="mr-1" /> New Loadout
        </Button>
      </div>

      {showCreate && (
        <div className="bg-[var(--surface)] border border-[var(--accent)]/30 p-4 clip-corner">
          <h3 className="text-sm font-medium text-[var(--text)] mb-3">Create Loadout</h3>
          <form onSubmit={createLoadout} className="grid grid-cols-2 gap-3">
            <Input
              label="Name"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
              placeholder="Software Engineer"
              required
            />
            <Input
              label="Slug (URL)"
              value={form.slug}
              onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
              placeholder="software-engineer"
              required
            />
            <div className="col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))} className="accent-[var(--accent)]" />
                Set as default loadout
              </label>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create'}</Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-[var(--muted)] text-sm">Loading...</div>
      ) : loadouts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--border)] text-[var(--muted)] text-sm">
          No loadouts yet. Create your first one above.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {loadouts.map(loadout => (
            <div key={loadout.id} className="bg-[var(--surface)] border border-[var(--border)] p-4 clip-corner hover:border-[var(--accent)]/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-[var(--accent)]" />
                  <span className="font-semibold text-sm text-[var(--text)]">{loadout.name}</span>
                </div>
                <div className="flex gap-1">
                  {loadout.isDefault && <Badge variant="accent">Default</Badge>}
                  <Button
                    variant={deletingId === loadout.id ? 'danger' : 'ghost'}
                    size="sm"
                    onClick={() => handleDelete(loadout.id)}
                    className="p-1 h-auto"
                  >
                    <Trash2 size={11} />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-[var(--muted)] font-mono mb-3">/{loadout.slug}</p>
              <div className="text-xs text-[var(--muted)] mb-4 space-y-0.5">
                <div>Max bullets/role: {loadout.exportRules.maxBulletsPerRole}</div>
                <div>Max projects: {loadout.exportRules.maxProjects}</div>
              </div>
              <Link href={`/admin/loadouts/${loadout.id}`}>
                <Button variant="outline" size="sm" className="w-full">Open Builder →</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
