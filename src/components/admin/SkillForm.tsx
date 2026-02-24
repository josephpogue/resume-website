'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Skill } from '@/types'

const GROUPS = ['Languages', 'Frameworks', 'Tools', 'Platforms', 'Security', 'Other']

interface Props { initial?: Skill | null; onSaved: () => void }

export function SkillForm({ initial, onSaved }: Props) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name:        initial?.name   ?? '',
    group:       initial?.group  ?? 'Tools',
    proficiency: initial?.proficiency ?? 3,
    tags:        (initial?.tags ?? []).join(', '),
    order:       initial?.order ?? 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), order: Number(form.order) }
    const url    = initial ? `/api/archive/skills/${initial.id}` : '/api/archive/skills'
    const method = initial ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <Input label="Skill Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Group</label>
        <select
          value={form.group}
          onChange={e => setForm(p => ({ ...p, group: e.target.value }))}
          className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
        >
          {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Proficiency (1–5)</label>
        <input type="range" min={1} max={5} value={form.proficiency} onChange={e => setForm(p => ({ ...p, proficiency: Number(e.target.value) }))} className="accent-[var(--accent)]" />
        <span className="text-xs text-[var(--muted)]">Level {form.proficiency}</span>
      </div>
      <Input label="Order" type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
      <div className="col-span-2 flex justify-end">
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
