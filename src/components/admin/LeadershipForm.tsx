'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import type { Leadership } from '@/types'

interface Props { initial?: Leadership | null; onSaved: () => void }

export function LeadershipForm({ initial, onSaved }: Props) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    org:       initial?.org       ?? '',
    role:      initial?.role      ?? '',
    startDate: initial?.startDate ?? '',
    endDate:   initial?.endDate   ?? '',
    bullets:   (initial?.bullets ?? []).join('\n'),
    tags:      (initial?.tags ?? []).join(', '),
    order:     initial?.order ?? 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      endDate: form.endDate || null,
      bullets: form.bullets.split('\n').map(b => b.trim()).filter(Boolean),
      tags:    form.tags.split(',').map(t => t.trim()).filter(Boolean),
      order:   Number(form.order),
    }
    const url    = initial ? `/api/archive/leadership/${initial.id}` : '/api/archive/leadership'
    const method = initial ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <Input label="Organization" value={form.org} onChange={e => setForm(p => ({ ...p, org: e.target.value }))} required />
      <Input label="Role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} required />
      <Input label="Start Date (YYYY-MM)" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} required />
      <Input label="End Date (YYYY-MM or blank)" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
      <div className="col-span-2">
        <Textarea label="Bullets (one per line)" value={form.bullets} onChange={e => setForm(p => ({ ...p, bullets: e.target.value }))} rows={4} placeholder="Led a team of 5 engineers..." />
      </div>
      <div className="col-span-2">
        <Input label="Tags (comma-separated)" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
      </div>
      <div className="col-span-2 flex justify-end">
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
