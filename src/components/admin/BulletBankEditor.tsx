'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Trash2, GripVertical, Save } from 'lucide-react'
import type { Bullet } from '@/types'

interface BulletRowProps {
  bullet: Bullet
  experienceId: string
  onSaved: (updated: Bullet) => void
  onDeleted: (id: string) => void
}

function BulletRow({ bullet, experienceId, onSaved, onDeleted }: BulletRowProps) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    text:          bullet.text,
    impactScore:   bullet.impactScore,
    metric:        bullet.metric ?? '',
    tags:          bullet.tags.join(', '),
  })

  async function save() {
    setSaving(true)
    const payload = {
      text:        form.text,
      impactScore: form.impactScore,
      metric:      form.metric || null,
      tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    const res = await fetch(
      `/api/archive/experiences/${experienceId}/bullets/${bullet.id}`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    )
    const updated = await res.json()
    setSaving(false)
    setEditing(false)
    onSaved(updated)
  }

  async function handleDelete() {
    await fetch(`/api/archive/experiences/${experienceId}/bullets/${bullet.id}`, { method: 'DELETE' })
    onDeleted(bullet.id)
  }

  if (!editing) {
    return (
      <div className="group flex items-start gap-2 p-2 hover:bg-[var(--border)]/20 rounded transition-colors">
        <GripVertical size={14} className="mt-0.5 text-[var(--muted)] shrink-0 cursor-grab" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--text)] leading-relaxed">{bullet.text}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-[var(--muted)]">Impact: {bullet.impactScore}/10</span>
            {bullet.metric && <Badge variant="accent">{bullet.metric}</Badge>}
            {bullet.tags.slice(0, 3).map(t => <Badge key={t} variant="muted">{t}</Badge>)}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="p-1 h-auto text-xs">Edit</Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="p-1 h-auto text-red-400 hover:text-red-300">
            <Trash2 size={11} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 bg-[var(--bg)] border border-[var(--accent)]/30 rounded space-y-2">
      <textarea
        value={form.text}
        onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
        className="w-full text-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-2 py-1.5 focus:outline-none focus:border-[var(--accent)] resize-none"
        rows={2}
        autoFocus
      />
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-[var(--muted)] uppercase">Impact (1–10)</label>
          <input
            type="number" min={1} max={10}
            value={form.impactScore}
            onChange={e => setForm(p => ({ ...p, impactScore: Number(e.target.value) }))}
            className="w-full text-xs bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-2 py-1 focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-[var(--muted)] uppercase">Metric</label>
          <input
            type="text"
            value={form.metric}
            onChange={e => setForm(p => ({ ...p, metric: e.target.value }))}
            placeholder="40%, $2M, 3x..."
            className="w-full text-xs bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-2 py-1 focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-[var(--muted)] uppercase">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
            placeholder="automation, infra"
            className="w-full text-xs bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-2 py-1 focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
        <Button size="sm" onClick={save} disabled={saving}>
          <Save size={11} className="mr-1" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

interface Props {
  experienceId: string
  initialBullets: Bullet[]
}

export function BulletBankEditor({ experienceId, initialBullets }: Props) {
  const [bullets, setBullets] = useState<Bullet[]>(initialBullets)
  const [adding, setAdding] = useState(false)
  const [newText, setNewText] = useState('')
  const [saving, setSaving] = useState(false)

  async function addBullet() {
    if (!newText.trim()) return
    setSaving(true)
    const res = await fetch(`/api/archive/experiences/${experienceId}/bullets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText, tags: [], impactScore: 5, order: bullets.length }),
    })
    const bullet = await res.json()
    setBullets(prev => [...prev, bullet])
    setNewText('')
    setAdding(false)
    setSaving(false)
  }

  function handleSaved(updated: Bullet) {
    setBullets(prev => prev.map(b => b.id === updated.id ? updated : b))
  }

  function handleDeleted(id: string) {
    setBullets(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
          Bullet Bank ({bullets.length})
        </h4>
        <Button variant="ghost" size="sm" onClick={() => setAdding(true)} className="text-xs">
          <Plus size={12} className="mr-1" /> Add Bullet
        </Button>
      </div>

      {bullets.map(bullet => (
        <BulletRow
          key={bullet.id}
          bullet={bullet}
          experienceId={experienceId}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      ))}

      {bullets.length === 0 && !adding && (
        <div className="text-center py-8 text-[var(--muted)] text-sm border border-dashed border-[var(--border)]">
          No bullets yet. Add your first one.
        </div>
      )}

      {adding && (
        <div className="p-3 bg-[var(--bg)] border border-[var(--accent)]/30 rounded space-y-2">
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Describe what you did and the impact..."
            className="w-full text-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-2 py-1.5 focus:outline-none focus:border-[var(--accent)] resize-none"
            rows={2}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addBullet() }}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" onClick={addBullet} disabled={saving || !newText.trim()}>
              {saving ? 'Adding...' : 'Add Bullet'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
