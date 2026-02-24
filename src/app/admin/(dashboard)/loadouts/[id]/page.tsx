'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Plus, Trash2, Pin, Download, Upload, X } from 'lucide-react'
import type { Loadout, LoadoutItem, Experience, Project, Skill, Education, Certification, Leadership, EntityType, TemplateDefinition } from '@/types'

type ArchiveData = {
  experiences: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
  certifications: Certification[]
  leadership: Leadership[]
}

function entityLabel(type: EntityType, item: ArchiveData[keyof ArchiveData][0]): string {
  switch (type) {
    case 'experience': { const e = item as Experience; return `${e.role} @ ${e.company}` }
    case 'project':    { const p = item as Project; return p.title }
    case 'skill':      { const s = item as Skill; return `${s.name} (${s.group})` }
    case 'education':  { const e = item as Education; return `${e.degree} – ${e.school}` }
    case 'certification': { const c = item as Certification; return c.name }
    case 'leadership': { const l = item as Leadership; return `${l.role} @ ${l.org}` }
  }
}

const ENTITY_TYPES: { type: EntityType; label: string; key: keyof ArchiveData }[] = [
  { type: 'experience',    label: 'Experiences',    key: 'experiences' },
  { type: 'project',       label: 'Projects',       key: 'projects' },
  { type: 'skill',         label: 'Skills',         key: 'skills' },
  { type: 'education',     label: 'Education',      key: 'education' },
  { type: 'certification', label: 'Certifications', key: 'certifications' },
  { type: 'leadership',    label: 'Leadership',     key: 'leadership' },
]

export default function LoadoutBuilderPage({ params }: { params: { id: string } }) {
  const [loadout, setLoadout] = useState<Loadout | null>(null)
  const [items, setItems] = useState<LoadoutItem[]>([])
  const [archive, setArchive] = useState<ArchiveData>({ experiences: [], projects: [], skills: [], education: [], certifications: [], leadership: [] })
  const [templates, setTemplates] = useState<TemplateDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [activeAddType, setActiveAddType] = useState<EntityType | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [savingTemplate, setSavingTemplate] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(async () => {
    const [loadoutRes, itemsRes, templatesRes, ...archiveRes] = await Promise.all([
      fetch(`/api/loadouts/${params.id}`),
      fetch(`/api/loadouts/${params.id}/items`),
      fetch('/api/templates'),
      ...ENTITY_TYPES.map(({ key }) => fetch(`/api/archive/${key}`)),
    ])
    const loadoutData = await loadoutRes.json()
    const itemsData = await itemsRes.json()
    const templatesData = await templatesRes.json()
    const archiveData = await Promise.all(archiveRes.map(r => r.json()))
    setLoadout(loadoutData)
    setItems(itemsData)
    setTemplates(templatesData)
    setArchive(Object.fromEntries(ENTITY_TYPES.map(({ key }, i) => [key, archiveData[i]])) as ArchiveData)
    setLoading(false)
  }, [params.id])

  useEffect(() => { refresh() }, [refresh])

  async function addItem(type: EntityType, entityId: string) {
    const order = items.filter(i => i.entityType === type).length
    await fetch(`/api/loadouts/${params.id}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: type, entityId, order }),
    })
    await refresh()
    setActiveAddType(null)
  }

  async function removeItem(itemId: string) {
    await fetch(`/api/loadouts/${params.id}/items/${itemId}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  async function togglePin(item: LoadoutItem) {
    await fetch(`/api/loadouts/${params.id}/items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: !item.pinned }),
    })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, pinned: !i.pinned } : i))
  }

  async function updateBulletCap(item: LoadoutItem, cap: number | null) {
    await fetch(`/api/loadouts/${params.id}/items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bulletCapOverride: cap }),
    })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, bulletCapOverride: cap } : i))
  }

  async function selectTemplate(templateId: string) {
    if (!loadout || savingTemplate) return
    setSavingTemplate(true)
    await fetch(`/api/loadouts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId }),
    })
    setLoadout(prev => prev ? { ...prev, templateId } : prev)
    setSavingTemplate(false)
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/uploads', { method: 'POST', body: fd })
      if (!res.ok) {
        const err = await res.json()
        alert(`Upload failed: ${err.error ?? 'Unknown error'}`)
        return
      }
      const { url } = await res.json()
      setPhotoUrl(url)
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function removePhoto() {
    if (!photoUrl) return
    const name = photoUrl.split('/').pop()
    if (name) await fetch(`/api/uploads?name=${name}`, { method: 'DELETE' })
    setPhotoUrl(null)
  }

  if (loading || !loadout) {
    return <div className="text-center py-20 text-[var(--muted)] text-sm">Loading...</div>
  }

  const currentTemplate = templates.find(t => t.id === (loadout.templateId ?? 'ats-classic'))
  const includedIds = new Set(items.map(i => `${i.entityType}:${i.entityId}`))
  const exportHref = photoUrl
    ? `/api/pdf/${loadout.id}?photo=${encodeURIComponent(photoUrl)}`
    : `/api/pdf/${loadout.id}`

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/loadouts" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[var(--text)]">{loadout.name}</h1>
          <p className="text-xs text-[var(--muted)] font-mono">/{loadout.slug}</p>
        </div>
        <a
          href={exportHref}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-medium clip-corner-sm hover:brightness-110 transition-all"
        >
          <Download size={12} /> Export PDF
        </a>
        <Link href={`/resume?loadout=${loadout.slug}`} target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors clip-corner-sm">
          Preview →
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Current items */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-3">
            Included ({items.length} items)
          </h3>

          {items.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[var(--border)] text-[var(--muted)] text-sm">
              No items yet. Add from the right panel.
            </div>
          ) : (
            <div className="space-y-1">
              {ENTITY_TYPES.map(({ type, label }) => {
                const typeItems = items.filter(i => i.entityType === type)
                if (typeItems.length === 0) return null
                return (
                  <div key={type} className="mb-3">
                    <div className="text-[10px] font-mono uppercase text-[var(--muted)] mb-1 px-2">{label}</div>
                    {typeItems.map(item => {
                      const archiveItems = archive[ENTITY_TYPES.find(t => t.type === type)!.key] as ArchiveData[keyof ArchiveData]
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const entity = archiveItems.find((e: any) => e.id === item.entityId)
                      return (
                        <div key={item.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-[var(--surface)] rounded group">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-[var(--text)] truncate block">
                              {entity ? entityLabel(type, entity) : item.entityId}
                            </span>
                          </div>
                          {type === 'experience' && (
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={item.bulletCapOverride ?? ''}
                              onChange={e => updateBulletCap(item, e.target.value ? Number(e.target.value) : null)}
                              placeholder={String(loadout.exportRules.maxBulletsPerRole)}
                              title="Bullet cap override"
                              className="w-10 text-xs bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] px-1 py-0.5 text-center focus:outline-none focus:border-[var(--accent)]"
                            />
                          )}
                          <button
                            onClick={() => togglePin(item)}
                            className={`text-xs shrink-0 ${item.pinned ? 'text-[var(--accent)]' : 'text-[var(--muted)] opacity-0 group-hover:opacity-100'} transition-all`}
                            title={item.pinned ? 'Unpin' : 'Pin (always include)'}
                          >
                            <Pin size={11} />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[var(--muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Archive browser */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-3">
            Add from Archive
          </h3>

          <div className="flex flex-wrap gap-1 mb-3">
            {ENTITY_TYPES.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setActiveAddType(activeAddType === type ? null : type)}
                className={`px-2 py-1 text-xs font-mono transition-colors ${
                  activeAddType === type
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeAddType && (
            <div className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin">
              {(archive[ENTITY_TYPES.find(t => t.type === activeAddType)!.key] as ArchiveData[keyof ArchiveData]).map((entity: ArchiveData[keyof ArchiveData][0]) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const entityAny = entity as any
                const alreadyIn = includedIds.has(`${activeAddType}:${entityAny.id}`)
                return (
                  <div key={entityAny.id} className={`flex items-center justify-between px-2 py-2 hover:bg-[var(--surface)] rounded transition-colors ${alreadyIn ? 'opacity-40' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-[var(--text)] truncate block">
                        {entityLabel(activeAddType, entity)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={alreadyIn ? 'ghost' : 'outline'}
                      disabled={alreadyIn}
                      onClick={() => addItem(activeAddType, entityAny.id)}
                      className="shrink-0 text-xs py-0.5 px-2"
                    >
                      {alreadyIn ? 'Added' : <><Plus size={10} className="mr-0.5" /> Add</>}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Template selector */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-4 clip-corner">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-3">
          Template {savingTemplate && <span className="text-[var(--accent)] ml-2">Saving...</span>}
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {templates.map(tmpl => {
            const isActive = (loadout.templateId ?? 'ats-classic') === tmpl.id
            const atsColor =
              tmpl.atsScore === 'high' ? 'text-green-400' :
              tmpl.atsScore === 'medium' ? 'text-yellow-400' :
              'text-[var(--accent)]'
            return (
              <button
                key={tmpl.id}
                onClick={() => selectTemplate(tmpl.id)}
                className={`text-left p-3 border transition-colors clip-corner-sm ${
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--bg)]'
                    : 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--muted)]'
                }`}
              >
                <div className={`text-xs font-semibold ${isActive ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>
                  {tmpl.name}
                  {isActive && <span className="ml-1.5 text-[var(--accent)] font-mono text-[10px]">● active</span>}
                </div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5 leading-relaxed">
                  {tmpl.description.slice(0, 80)}{tmpl.description.length > 80 ? '…' : ''}
                </div>
                <div className="text-[10px] mt-1.5 font-mono flex gap-3">
                  <span className={atsColor}>ATS: {tmpl.atsScore}</span>
                  <span className="text-[var(--muted)]">engine: {tmpl.engine}</span>
                  {tmpl.supportsPhoto && <span className="text-[var(--accent2)]">photo</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Photo upload — only shown when current template supports it */}
      {currentTemplate?.supportsPhoto && (
        <div className="bg-[var(--surface)] border border-[var(--border)] p-4 clip-corner">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-3">
            Profile Photo
          </h3>
          {photoUrl ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Profile photo"
                className="w-16 h-16 object-cover border border-[var(--border)]"
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
              />
              <div className="flex-1">
                <p className="text-xs text-[var(--muted)] font-mono">{photoUrl}</p>
                <p className="text-[11px] text-[var(--muted)] mt-1">
                  Will be included when exporting with this template.
                </p>
              </div>
              <button
                onClick={removePhoto}
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                title="Remove photo"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                <Upload size={12} className="mr-1.5" />
                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </Button>
              <p className="text-[11px] text-[var(--muted)] mt-2">
                JPEG, PNG, or WebP · max 5MB · stored in /public/uploads/
              </p>
            </div>
          )}
        </div>
      )}

      {/* Export Rules */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-4 clip-corner">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-3">Export Rules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[var(--muted)]">
          <div><div className="font-medium text-[var(--text)]">{loadout.exportRules.minBullets}</div>Min bullets/role</div>
          <div><div className="font-medium text-[var(--text)]">{loadout.exportRules.maxBulletsPerRole}</div>Max bullets/role</div>
          <div><div className="font-medium text-[var(--text)]">{loadout.exportRules.maxProjects}</div>Max projects</div>
          <div><div className="font-medium text-[var(--text)]">{loadout.exportRules.fontScaleRange[0]}–{loadout.exportRules.fontScaleRange[1]}</div>Font scale range</div>
        </div>
      </div>
    </div>
  )
}
