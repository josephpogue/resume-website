'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import type { Experience } from '@/types'

interface Props {
  initial?: Experience | null
  onSaved: () => void
}

export function ExperienceForm({ initial, onSaved }: Props) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    company:     initial?.company     ?? '',
    role:        initial?.role        ?? '',
    startDate:   initial?.startDate   ?? '',
    endDate:     initial?.endDate     ?? '',
    location:    initial?.location    ?? '',
    description: initial?.description ?? '',
    tags:        (initial?.tags ?? []).join(', '),
    order:       initial?.order ?? 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      endDate:  form.endDate || null,
      location: form.location || null,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      order: Number(form.order),
    }
    const url  = initial ? `/api/archive/experiences/${initial.id}` : '/api/archive/experiences'
    const method = initial ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <Input label="Company" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} required />
      <Input label="Role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} required />
      <Input label="Start Date (YYYY-MM)" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} placeholder="2022-03" required />
      <Input label="End Date (YYYY-MM or blank)" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} placeholder="Present if blank" />
      <Input label="Location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="City, State or Remote" />
      <Input label="Order" type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
      <div className="col-span-2">
        <Textarea label="Private Description / Notes" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Internal notes (never shown publicly)" />
      </div>
      <div className="col-span-2">
        <Input label="Tags (comma-separated)" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="automation, vmware, security, leadership" />
      </div>
      <div className="col-span-2 flex justify-end">
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
