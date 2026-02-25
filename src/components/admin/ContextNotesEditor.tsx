'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Sparkles, Plus, Trash2, Save, X, Loader2, Bot, Pencil } from 'lucide-react'
import type { ContextNote } from '@/types'

interface Props {
  entityType: 'experience' | 'project' | 'skill'
  entityId: string
}

function NoteCard({
  note,
  onSaved,
  onDeleted,
}: {
  note: ContextNote
  onSaved: (updated: ContextNote) => void
  onDeleted: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(note.content)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const res = await fetch(`/api/context-notes/${note.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    const updated = await res.json()
    setSaving(false)
    setEditing(false)
    onSaved(updated)
  }

  async function handleDelete() {
    await fetch(`/api/context-notes/${note.id}`, { method: 'DELETE' })
    onDeleted(note.id)
  }

  return (
    <div className="border border-[var(--border)] bg-[var(--darker)] p-3 space-y-2">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {note.aiGenerated && (
            <Bot size={11} className="text-[var(--accent2)]" />
          )}
          <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
            {note.source === 'import' ? 'from import' : note.source === 'on-demand' ? 'ai generated' : 'manual'}
          </span>
          <span className="text-[10px] text-[var(--muted)]/50">
            · {new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <Pencil size={12} />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1 text-[var(--muted)] hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            className="w-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] p-2 resize-y font-[var(--font-mono-val)] leading-relaxed focus:outline-none focus:border-[var(--accent)]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 size={12} className="animate-spin mr-1" /> : <Save size={12} className="mr-1" />}
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setEditing(false); setContent(note.content) }}
            >
              <X size={12} className="mr-1" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[var(--text)] whitespace-pre-wrap leading-relaxed">{note.content}</p>
      )}
    </div>
  )
}

export function ContextNotesEditor({ entityType, entityId }: Props) {
  const [notes, setNotes] = useState<ContextNote[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [addingManual, setAddingManual] = useState(false)
  const [manualContent, setManualContent] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchNotes = useCallback(async () => {
    const res = await fetch(`/api/context-notes?entityType=${entityType}&entityId=${entityId}`)
    const data = await res.json()
    setNotes(data)
    setLoading(false)
  }, [entityType, entityId])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  async function generate() {
    setGenerating(true)
    const res = await fetch('/api/context-notes/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType, entityId }),
    })
    if (res.ok) {
      const note = await res.json()
      setNotes(prev => [...prev, note])
    }
    setGenerating(false)
  }

  async function saveManual() {
    if (!manualContent.trim()) return
    setSaving(true)
    const res = await fetch('/api/context-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType, entityId, content: manualContent.trim(), source: 'manual' }),
    })
    if (res.ok) {
      const note = await res.json()
      setNotes(prev => [...prev, note])
      setManualContent('')
      setAddingManual(false)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[var(--accent)] uppercase tracking-widest">
            // CONTEXT INTEL
          </span>
          <div className="h-px w-8 bg-[var(--accent)]/40" />
          <span className="text-[10px] text-[var(--muted)]">private · never shown publicly</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAddingManual(v => !v)}
            disabled={generating}
          >
            <Plus size={12} className="mr-1" /> Add Note
          </Button>
          <Button size="sm" onClick={generate} disabled={generating}>
            {generating ? (
              <><Loader2 size={12} className="animate-spin mr-1" /> Generating…</>
            ) : (
              <><Sparkles size={12} className="mr-1" /> Generate Context</>
            )}
          </Button>
        </div>
      </div>

      {/* Manual add form */}
      {addingManual && (
        <div className="border border-[var(--border)] bg-[var(--darker)] p-3 space-y-2">
          <textarea
            value={manualContent}
            onChange={e => setManualContent(e.target.value)}
            placeholder="Brain dump anything about this role — responsibilities, challenges, tech depth, team context, things that wouldn't fit on a resume…"
            rows={6}
            autoFocus
            className="w-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] p-2 resize-y font-[var(--font-mono-val)] leading-relaxed focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted)]/60"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={saveManual} disabled={saving || !manualContent.trim()}>
              {saving ? <Loader2 size={12} className="animate-spin mr-1" /> : <Save size={12} className="mr-1" />}
              Save Note
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setAddingManual(false); setManualContent('') }}>
              <X size={12} className="mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {loading ? (
        <div className="flex items-center gap-2 text-[var(--muted)] text-xs py-2">
          <Loader2 size={12} className="animate-spin" /> Loading context notes…
        </div>
      ) : notes.length === 0 && !addingManual ? (
        <div className="text-xs text-[var(--muted)] py-4 text-center border border-dashed border-[var(--border)]">
          No context notes yet. Generate with AI or add manually.
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onSaved={updated => setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))}
              onDeleted={id => setNotes(prev => prev.filter(n => n.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
