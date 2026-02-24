'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Education } from '@/types'

interface Props { initial?: Education | null; onSaved: () => void }

export function EducationForm({ initial, onSaved }: Props) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    school:    initial?.school    ?? '',
    degree:    initial?.degree    ?? '',
    field:     initial?.field     ?? '',
    startDate: initial?.startDate ?? '',
    endDate:   initial?.endDate   ?? '',
    gpa:       initial?.gpa       ?? '',
    honors:    initial?.honors    ?? '',
    order:     initial?.order ?? 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      field:   form.field   || null,
      endDate: form.endDate || null,
      gpa:     form.gpa     || null,
      honors:  form.honors  || null,
      order:   Number(form.order),
    }
    const url    = initial ? `/api/archive/education/${initial.id}` : '/api/archive/education'
    const method = initial ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <Input label="School" value={form.school} onChange={e => setForm(p => ({ ...p, school: e.target.value }))} required />
      <Input label="Degree" value={form.degree} onChange={e => setForm(p => ({ ...p, degree: e.target.value }))} required />
      <Input label="Field of Study" value={form.field} onChange={e => setForm(p => ({ ...p, field: e.target.value }))} />
      <Input label="Start Date (YYYY-MM)" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} required />
      <Input label="End Date (YYYY-MM or blank)" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
      <Input label="GPA" value={form.gpa} onChange={e => setForm(p => ({ ...p, gpa: e.target.value }))} placeholder="3.8" />
      <div className="col-span-2 flex justify-end">
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
