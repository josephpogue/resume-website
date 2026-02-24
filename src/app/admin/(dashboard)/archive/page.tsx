'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { EntityTable, Column } from '@/components/admin/EntityTable'
import { Badge } from '@/components/ui/Badge'
import { ExperienceForm } from '@/components/admin/ExperienceForm'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { SkillForm } from '@/components/admin/SkillForm'
import { EducationForm } from '@/components/admin/EducationForm'
import { CertificationForm } from '@/components/admin/CertificationForm'
import { LeadershipForm } from '@/components/admin/LeadershipForm'
import { Plus, Edit } from 'lucide-react'
import { formatDateRange } from '@/lib/utils'
import type { Experience, Project, Skill, Education, Certification, Leadership } from '@/types'

type Tab = 'experiences' | 'projects' | 'skills' | 'education' | 'certifications' | 'leadership'

const TABS: { id: Tab; label: string }[] = [
  { id: 'experiences',    label: 'Experiences' },
  { id: 'projects',       label: 'Projects' },
  { id: 'skills',         label: 'Skills' },
  { id: 'education',      label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'leadership',     label: 'Leadership' },
]

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<Tab>('experiences')
  const [data, setData] = useState<Record<Tab, unknown[]>>({
    experiences: [], projects: [], skills: [], education: [], certifications: [], leadership: [],
  })
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState<unknown | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchTab = useCallback(async (tab: Tab) => {
    setLoading(true)
    const res = await fetch(`/api/archive/${tab}`)
    const json = await res.json()
    setData(prev => ({ ...prev, [tab]: json }))
    setLoading(false)
  }, [])

  useEffect(() => { fetchTab(activeTab) }, [activeTab, fetchTab])

  function handleEdit(item: unknown) {
    setEditItem(item)
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/archive/${activeTab}/${id}`, { method: 'DELETE' })
    fetchTab(activeTab)
  }

  function handleSaved() {
    setShowForm(false)
    setEditItem(null)
    fetchTab(activeTab)
  }

  const expColumns: Column<Experience>[] = [
    { key: 'role', label: 'Role', render: e => <span className="font-medium">{e.role}</span> },
    { key: 'company', label: 'Company', render: e => <span className="text-[var(--accent)]">{e.company}</span> },
    { key: 'dates', label: 'Dates', render: e => <span className="text-[var(--muted)] text-xs">{formatDateRange(e.startDate, e.endDate)}</span> },
    { key: 'bullets', label: 'Bullets', render: e => (
        <div className="flex items-center gap-2">
          <Badge variant="muted">{e.bullets?.length ?? 0} bullets</Badge>
          <Link href={`/admin/archive/experiences/${e.id}`} className="text-[var(--accent)] text-xs hover:underline flex items-center gap-1">
            <Edit size={10} /> Edit bullets
          </Link>
        </div>
      )
    },
    { key: 'tags', label: 'Tags', render: e => (
        <div className="flex flex-wrap gap-1">
          {e.tags.slice(0, 3).map(t => <Badge key={t} variant="muted">{t}</Badge>)}
          {e.tags.length > 3 && <Badge variant="muted">+{e.tags.length - 3}</Badge>}
        </div>
      )
    },
  ]

  const projColumns: Column<Project>[] = [
    { key: 'title', label: 'Title', render: p => <span className="font-medium">{p.title}</span> },
    { key: 'slug',  label: 'Slug',  render: p => <span className="font-mono text-xs text-[var(--muted)]">{p.slug}</span> },
    { key: 'pitch', label: 'Pitch', render: p => <span className="text-xs text-[var(--muted)] truncate max-w-xs block">{p.pitch}</span> },
    { key: 'featured', label: '', render: p => p.featured ? <Badge variant="accent">Featured</Badge> : null },
    { key: 'techStack', label: 'Stack', render: p => (
        <div className="flex flex-wrap gap-1">
          {p.techStack.slice(0, 3).map(t => <Badge key={t} variant="cyan">{t}</Badge>)}
        </div>
      )
    },
  ]

  const skillColumns: Column<Skill>[] = [
    { key: 'name',  label: 'Name',  render: s => <span className="font-medium">{s.name}</span> },
    { key: 'group', label: 'Group', render: s => <Badge variant="muted">{s.group}</Badge> },
    { key: 'proficiency', label: 'Level', render: s => (
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(n => (
            <div key={n} className={`w-2 h-2 rounded-full ${n <= s.proficiency ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
          ))}
        </div>
      )
    },
  ]

  const eduColumns: Column<Education>[] = [
    { key: 'school', label: 'School', render: e => <span className="font-medium">{e.school}</span> },
    { key: 'degree', label: 'Degree' },
    { key: 'dates',  label: 'Dates', render: e => <span className="text-xs text-[var(--muted)]">{formatDateRange(e.startDate, e.endDate)}</span> },
  ]

  const certColumns: Column<Certification>[] = [
    { key: 'name',   label: 'Name',   render: c => <span className="font-medium">{c.name}</span> },
    { key: 'issuer', label: 'Issuer', render: c => <span className="text-[var(--muted)]">{c.issuer}</span> },
    { key: 'date',   label: 'Date',   render: c => <span className="text-xs text-[var(--muted)]">{c.date}</span> },
    { key: 'expires', label: 'Expires', render: c => c.expires ? <span className="text-xs">{c.expires}</span> : <span className="text-xs text-[var(--muted)]">Never</span> },
  ]

  const leadColumns: Column<Leadership>[] = [
    { key: 'org',  label: 'Org',  render: l => <span className="font-medium">{l.org}</span> },
    { key: 'role', label: 'Role', render: l => <span className="text-[var(--muted)]">{l.role}</span> },
    { key: 'dates', label: 'Dates', render: l => <span className="text-xs text-[var(--muted)]">{formatDateRange(l.startDate, l.endDate)}</span> },
    { key: 'bullets', label: 'Bullets', render: l => <Badge variant="muted">{l.bullets.length} bullets</Badge> },
  ]

  const columnMap = { experiences: expColumns, projects: projColumns, skills: skillColumns, education: eduColumns, certifications: certColumns, leadership: leadColumns }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">
            <span className="neon-red">Archive</span>
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Your private career database</p>
        </div>
        <Button onClick={() => { setEditItem(null); setShowForm(true) }} size="sm">
          <Plus size={14} className="mr-1" /> Add {activeTab.slice(0, -1)}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowForm(false) }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-60">({(data[tab.id] as unknown[]).length})</span>
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[var(--surface)] border border-[var(--accent)]/30 p-4 clip-corner">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[var(--text)]">
              {editItem ? `Edit ${activeTab.slice(0, -1)}` : `New ${activeTab.slice(0, -1)}`}
            </h3>
            <button onClick={() => { setShowForm(false); setEditItem(null) }} className="text-[var(--muted)] hover:text-[var(--text)] text-xs">✕ Cancel</button>
          </div>
          {activeTab === 'experiences'    && <ExperienceForm    initial={editItem as Experience | null}    onSaved={handleSaved} />}
          {activeTab === 'projects'       && <ProjectForm       initial={editItem as Project | null}       onSaved={handleSaved} />}
          {activeTab === 'skills'         && <SkillForm         initial={editItem as Skill | null}         onSaved={handleSaved} />}
          {activeTab === 'education'      && <EducationForm     initial={editItem as Education | null}     onSaved={handleSaved} />}
          {activeTab === 'certifications' && <CertificationForm initial={editItem as Certification | null} onSaved={handleSaved} />}
          {activeTab === 'leadership'     && <LeadershipForm    initial={editItem as Leadership | null}    onSaved={handleSaved} />}
        </div>
      )}

      {/* Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] clip-corner overflow-hidden">
        <EntityTable
          items={data[activeTab] as (Experience | Project | Skill | Education | Certification | Leadership)[]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={columnMap[activeTab] as Column<any>[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage={`No ${activeTab} yet. Add your first one above.`}
        />
      </div>
    </div>
  )
}
