'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import type { Project } from '@/types'

interface Props {
  initial?: Project | null
  onSaved: () => void
}

export function ProjectForm({ initial, onSaved }: Props) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title:     initial?.title     ?? '',
    slug:      initial?.slug      ?? '',
    pitch:     initial?.pitch     ?? '',
    casestudy: initial?.casestudy ?? '',
    githubUrl: initial?.githubUrl ?? '',
    demoUrl:   initial?.demoUrl   ?? '',
    tags:      (initial?.tags ?? []).join(', '),
    techStack: (initial?.techStack ?? []).join(', '),
    featured:  initial?.featured ?? false,
    order:     initial?.order ?? 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      casestudy: form.casestudy || null,
      githubUrl: form.githubUrl || null,
      demoUrl:   form.demoUrl   || null,
      tags:      form.tags.split(',').map(t => t.trim()).filter(Boolean),
      techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
      order:     Number(form.order),
    }
    const url    = initial ? `/api/archive/projects/${initial.id}` : '/api/archive/projects'
    const method = initial ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <Input label="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
      <Input label="Slug (lowercase-dashes)" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} placeholder="my-project" required />
      <div className="col-span-2">
        <Input label="One-line pitch" value={form.pitch} onChange={e => setForm(p => ({ ...p, pitch: e.target.value }))} required />
      </div>
      <Input label="GitHub URL" value={form.githubUrl} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
      <Input label="Demo/Docs URL" value={form.demoUrl} onChange={e => setForm(p => ({ ...p, demoUrl: e.target.value }))} placeholder="https://..." />
      <div className="col-span-2">
        <Textarea label="Case Study (private)" value={form.casestudy} onChange={e => setForm(p => ({ ...p, casestudy: e.target.value }))} rows={4} placeholder="Problem → Approach → Impact → Evidence" />
      </div>
      <Input label="Tags (comma-separated)" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
      <Input label="Tech Stack (comma-separated)" value={form.techStack} onChange={e => setForm(p => ({ ...p, techStack: e.target.value }))} />
      <div className="col-span-2 flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="accent-[var(--accent)]" />
          Featured on home page
        </label>
        <div className="ml-auto">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : initial ? 'Update' : 'Create'}</Button>
        </div>
      </div>
    </form>
  )
}
