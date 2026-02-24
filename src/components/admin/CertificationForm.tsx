'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Certification } from '@/types'

interface Props { initial?: Certification | null; onSaved: () => void }

export function CertificationForm({ initial, onSaved }: Props) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name:    initial?.name    ?? '',
    issuer:  initial?.issuer  ?? '',
    date:    initial?.date    ?? '',
    expires: initial?.expires ?? '',
    credUrl: initial?.credUrl ?? '',
    order:   initial?.order ?? 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      expires: form.expires || null,
      credUrl: form.credUrl || null,
      order:   Number(form.order),
    }
    const url    = initial ? `/api/archive/certifications/${initial.id}` : '/api/archive/certifications'
    const method = initial ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <Input label="Certification Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
      <Input label="Issuing Organization" value={form.issuer} onChange={e => setForm(p => ({ ...p, issuer: e.target.value }))} required />
      <Input label="Date Earned (YYYY-MM)" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
      <Input label="Expires (YYYY-MM or blank)" value={form.expires} onChange={e => setForm(p => ({ ...p, expires: e.target.value }))} />
      <div className="col-span-2">
        <Input label="Credential URL" value={form.credUrl} onChange={e => setForm(p => ({ ...p, credUrl: e.target.value }))} placeholder="https://..." />
      </div>
      <div className="col-span-2 flex justify-end">
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
