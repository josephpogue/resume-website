'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  CloudOff,
  FileText,
  FileSearch,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Link2,
  FolderOpen,
  Upload,
  HardDrive,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DriveFile {
  id: string
  name: string
  mimeType: string
  modifiedTime: string
}

interface ParsedBullet { text: string; metric: string | null }
interface ParsedExperience {
  company: string; role: string; startDate: string; endDate: string | null
  location: string | null; description: string | null; tags: string[]
  bullets: ParsedBullet[]
  contextNotes?: string | null
}
interface ParsedEducation {
  school: string; degree: string; field: string | null
  startDate: string; endDate: string | null; gpa: string | null; honors: string | null
}
interface ParsedSkill { name: string; group: string; proficiency: number }
interface ParsedCertification {
  name: string; issuer: string; date: string; expires: string | null; credUrl: string | null
}
interface ParsedLeadership {
  org: string; role: string; startDate: string; endDate: string | null
  bullets: string[]; tags: string[]
}
interface ParsedProject {
  title: string; pitch: string; casestudy: string | null
  githubUrl: string | null; demoUrl: string | null
  tags: string[]; techStack: string[]; featured: boolean
}

interface ParsedData {
  experiences?: ParsedExperience[]
  education?: ParsedEducation[]
  skills?: ParsedSkill[]
  certifications?: ParsedCertification[]
  leadership?: ParsedLeadership[]
  projects?: ParsedProject[]
}

type ItemKey = string // `${section}.${index}`
type ImportResult = { key: ItemKey; ok: boolean; error?: string }
type ImportSource = 'drive' | 'local'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function normalizeDate(d: string | null | undefined): string | undefined {
  if (!d) return undefined
  if (/present|current|now|ongoing/i.test(d)) return undefined
  if (/^\d{4}(-\d{2})?$/.test(d)) return d
  const match = d.match(/(\d{4})/)
  return match ? match[1] : undefined
}

function normalizeUrl(u: string | null | undefined): string | undefined {
  if (!u) return undefined
  try { new URL(u); return u } catch { return undefined }
}

function formatModified(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({
  title, count, children, defaultOpen = true,
}: {
  title: string; count: number; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] clip-corner">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)]/20 transition-colors"
      >
        <span>
          {title}
          <span className="ml-2 text-xs text-[var(--muted)]">({count})</span>
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="border-t border-[var(--border)] divide-y divide-[var(--border)]">{children}</div>}
    </div>
  )
}

function ItemRow({
  itemKey, selected, onToggle, imported, result, children,
}: {
  itemKey: ItemKey
  selected: boolean
  onToggle: (key: ItemKey) => void
  imported: boolean
  result?: ImportResult
  children: React.ReactNode
}) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 transition-colors ${imported && result?.ok ? 'opacity-50' : ''}`}>
      {imported && result?.ok ? (
        <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-500" />
      ) : (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(itemKey)}
          className="mt-1 shrink-0 accent-[var(--accent)]"
        />
      )}
      <div className="flex-1 min-w-0">{children}</div>
      {result && !result.ok && (
        <span className="text-xs text-red-400 shrink-0">{result.error ?? 'Failed'}</span>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ImportPage() {
  const searchParams = useSearchParams()
  const oauthError = searchParams.get('error')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [driveStatus, setDriveStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading')
  const [activeSource, setActiveSource] = useState<ImportSource>('drive')

  // Drive source state
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null)
  const [pickerLoading, setPickerLoading] = useState(false)

  // Local source state
  const [localFile, setLocalFile] = useState<File | null>(null)

  // Shared parse/import state
  const [parsing, setParsing] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<ItemKey>>(new Set())
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<ImportResult[]>([])

  // ── Check Drive connection ──
  const checkConnection = useCallback(async () => {
    setDriveStatus('loading')
    const res = await fetch('/api/auth/google/token')
    setDriveStatus(res.ok ? 'connected' : 'disconnected')
  }, [])

  useEffect(() => { checkConnection() }, [checkConnection])

  // ── Reset parse state on source switch ──
  function switchSource(source: ImportSource) {
    setActiveSource(source)
    setParsedData(null)
    setParseError(null)
    setSelected(new Set())
    setResults([])
  }

  // ── Select/deselect all ──
  function buildAllKeys(data: ParsedData): ItemKey[] {
    const keys: ItemKey[] = []
    data.experiences?.forEach((_, i) => keys.push(`experiences.${i}`))
    data.education?.forEach((_, i) => keys.push(`education.${i}`))
    data.skills?.forEach((_, i) => keys.push(`skills.${i}`))
    data.certifications?.forEach((_, i) => keys.push(`certifications.${i}`))
    data.leadership?.forEach((_, i) => keys.push(`leadership.${i}`))
    data.projects?.forEach((_, i) => keys.push(`projects.${i}`))
    return keys
  }

  function toggleKey(key: ItemKey) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function selectAll() {
    if (!parsedData) return
    setSelected(new Set(buildAllKeys(parsedData)))
  }

  function deselectAll() { setSelected(new Set()) }

  // ── Open Google Drive Picker ──
  async function openPicker() {
    setPickerLoading(true)
    try {
      const tokenRes = await fetch('/api/auth/google/token')
      if (!tokenRes.ok) { setDriveStatus('disconnected'); return }
      const { accessToken } = await tokenRes.json()

      await loadScript('https://apis.google.com/js/api.js')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any
      await new Promise<void>(resolve => w.gapi.load('picker', resolve))

      const myDriveView = new w.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false)
        .setMimeTypes('application/vnd.google-apps.document,application/pdf')
        .setParent('root')

      const sharedDriveView = new w.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false)
        .setEnableDrives(true)
        .setMimeTypes('application/vnd.google-apps.document,application/pdf')

      new w.google.picker.PickerBuilder()
        .addView(myDriveView)
        .addView(sharedDriveView)
        .enableFeature(w.google.picker.Feature.SUPPORT_DRIVES)
        .setTitle('Select a Document')
        .setOAuthToken(accessToken)
        .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '')
        .setCallback((data: { action: string; docs: Array<{ id: string; name: string; mimeType: string; lastEditedUtc: number }> }) => {
          if (data.action === 'picked') {
            const doc = data.docs[0]
            handleSelectDriveFile({
              id: doc.id,
              name: doc.name,
              mimeType: doc.mimeType,
              modifiedTime: doc.lastEditedUtc
                ? new Date(doc.lastEditedUtc).toISOString()
                : new Date().toISOString(),
            })
          }
        })
        .build()
        .setVisible(true)
    } catch (err) {
      console.error('Failed to open Google Drive picker:', err)
    } finally {
      setPickerLoading(false)
    }
  }

  // ── Select Drive file (resets parse state) ──
  function handleSelectDriveFile(file: DriveFile) {
    setSelectedFile(file)
    setParsedData(null)
    setParseError(null)
    setSelected(new Set())
    setResults([])
  }

  // ── Select local file ──
  function handleLocalFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setLocalFile(file)
    setParsedData(null)
    setParseError(null)
    setSelected(new Set())
    setResults([])
  }

  // ── Active filename for display ──
  const activeFileName = activeSource === 'drive' ? selectedFile?.name : localFile?.name

  // ── Parse ──
  async function handleParse() {
    setParsedData(null)
    setParseError(null)
    setSelected(new Set())
    setResults([])
    setParsing(true)

    try {
      let res: Response

      if (activeSource === 'drive') {
        if (!selectedFile) return
        res = await fetch('/api/drive/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId: selectedFile.id, mimeType: selectedFile.mimeType }),
        })
      } else {
        if (!localFile) return
        const formData = new FormData()
        formData.append('file', localFile)
        res = await fetch('/api/local/import', { method: 'POST', body: formData })
      }

      if (!res.ok) {
        const err = await res.json()
        setParseError(err.error ?? 'Failed to parse file')
        return
      }

      const data: ParsedData = await res.json()
      setParsedData(data)
      setSelected(new Set(buildAllKeys(data)))
    } finally {
      setParsing(false)
    }
  }

  // ── Import selected ──
  async function handleImport() {
    if (!parsedData) return
    setImporting(true)
    const importResults: ImportResult[] = []

    async function post(url: string, body: object): Promise<boolean> {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      return res.ok
    }

    for (const key of Array.from(selected)) {
      const [section, idxStr] = key.split('.')
      const idx = parseInt(idxStr)

      try {
        if (section === 'experiences') {
          const exp = parsedData.experiences![idx]
          const res = await fetch('/api/archive/experiences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              company: exp.company,
              role: exp.role,
              startDate: normalizeDate(exp.startDate) ?? exp.startDate,
              endDate: normalizeDate(exp.endDate),
              location: exp.location ?? undefined,
              description: exp.description ?? undefined,
              tags: exp.tags ?? [],
            }),
          })
          if (res.ok) {
            const created = await res.json()
            for (const bullet of exp.bullets ?? []) {
              await post(`/api/archive/experiences/${created.id}/bullets`, {
                text: bullet.text,
                metric: bullet.metric ?? undefined,
                tags: [],
                impactScore: 5,
                relevanceScore: 5,
              })
            }
            if (exp.contextNotes) {
              await post('/api/context-notes', {
                entityType: 'experience',
                entityId: created.id,
                content: exp.contextNotes,
                aiGenerated: true,
                source: 'import',
              })
            }
            importResults.push({ key, ok: true })
          } else {
            importResults.push({ key, ok: false, error: 'Save failed' })
          }
        } else if (section === 'education') {
          const edu = parsedData.education![idx]
          const ok = await post('/api/archive/education', {
            school: edu.school,
            degree: edu.degree,
            field: edu.field ?? undefined,
            startDate: normalizeDate(edu.startDate) ?? edu.startDate,
            endDate: normalizeDate(edu.endDate),
            gpa: edu.gpa ?? undefined,
            honors: edu.honors ?? undefined,
          })
          importResults.push({ key, ok })
        } else if (section === 'skills') {
          const skill = parsedData.skills![idx]
          const ok = await post('/api/archive/skills', {
            name: skill.name,
            group: skill.group,
            proficiency: skill.proficiency ?? 3,
            tags: [],
          })
          importResults.push({ key, ok })
        } else if (section === 'certifications') {
          const cert = parsedData.certifications![idx]
          const ok = await post('/api/archive/certifications', {
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
            expires: cert.expires ?? undefined,
            credUrl: cert.credUrl ?? undefined,
          })
          importResults.push({ key, ok })
        } else if (section === 'leadership') {
          const lead = parsedData.leadership![idx]
          const ok = await post('/api/archive/leadership', {
            org: lead.org,
            role: lead.role,
            startDate: normalizeDate(lead.startDate) ?? lead.startDate,
            endDate: normalizeDate(lead.endDate),
            bullets: lead.bullets ?? [],
            tags: lead.tags ?? [],
          })
          importResults.push({ key, ok })
        } else if (section === 'projects') {
          const proj = parsedData.projects![idx]
          const ok = await post('/api/archive/projects', {
            title: proj.title,
            slug: slugify(proj.title),
            pitch: proj.pitch,
            casestudy: proj.casestudy ?? undefined,
            githubUrl: normalizeUrl(proj.githubUrl),
            demoUrl: normalizeUrl(proj.demoUrl),
            tags: proj.tags ?? [],
            techStack: proj.techStack ?? [],
            featured: proj.featured ?? false,
          })
          importResults.push({ key, ok })
        }
      } catch {
        importResults.push({ key, ok: false, error: 'Network error' })
      }
    }

    setResults(importResults)
    setImporting(false)
  }

  const importedKeys = new Set(results.map(r => r.key))
  const totalItems = parsedData ? buildAllKeys(parsedData).length : 0
  const successCount = results.filter(r => r.ok).length
  const canParse = activeSource === 'drive' ? !!selectedFile : !!localFile

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">
            <span className="neon-red">Import</span>
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Import career data from Google Drive or a local file — Claude will extract structured data
          </p>
        </div>
        {driveStatus === 'connected' && (
          <button
            onClick={checkConnection}
            className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
          >
            <Link2 size={12} /> Drive connected
          </button>
        )}
      </div>

      {oauthError && (
        <div className="bg-red-900/20 border border-red-500/30 px-4 py-3 text-sm text-red-400 clip-corner">
          OAuth failed — please try again.
        </div>
      )}

      {/* Source tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        <button
          onClick={() => switchSource('drive')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeSource === 'drive'
              ? 'border-[var(--accent)] text-[var(--text)]'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <FolderOpen size={14} />
          Google Drive
        </button>
        <button
          onClick={() => switchSource('local')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeSource === 'local'
              ? 'border-[var(--accent)] text-[var(--text)]'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <HardDrive size={14} />
          Local File
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Source panel ── */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider">
            Document
          </h2>

          {/* ── Google Drive tab ── */}
          {activeSource === 'drive' && (
            <>
              {driveStatus === 'loading' && (
                <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  Checking connection…
                </div>
              )}

              {driveStatus === 'disconnected' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] clip-corner p-5 space-y-3 text-center">
                  <CloudOff size={28} className="mx-auto text-[var(--muted)]" />
                  <div>
                    <p className="font-medium text-sm text-[var(--text)]">Connect Google Drive</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Grant read-only access so Claude can parse your documents
                    </p>
                  </div>
                  <a
                    href="/api/auth/google"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium bg-[var(--accent)] text-white hover:brightness-110 clip-corner-sm transition-all"
                  >
                    Connect Google Drive
                  </a>
                </div>
              )}

              {driveStatus === 'connected' && (
                <>
                  {selectedFile && (
                    <div className="border border-[var(--accent)]/50 bg-[var(--accent)]/5 clip-corner px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        {selectedFile.mimeType === 'application/pdf' ? (
                          <FileText size={14} className="shrink-0 text-red-400" />
                        ) : (
                          <FileSearch size={14} className="shrink-0 text-blue-400" />
                        )}
                        <span className="truncate font-medium text-sm text-[var(--text)]">{selectedFile.name}</span>
                      </div>
                      <p className="text-[10px] text-[var(--muted)] mt-0.5 pl-5">
                        {selectedFile.mimeType === 'application/pdf' ? 'PDF' : 'Google Doc'} ·{' '}
                        {formatModified(selectedFile.modifiedTime)}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={openPicker}
                    disabled={pickerLoading || parsing}
                    className="w-full"
                  >
                    {pickerLoading ? (
                      <><Loader2 size={14} className="animate-spin mr-2" /> Opening Drive…</>
                    ) : (
                      <><FolderOpen size={14} className="mr-2" />{selectedFile ? 'Choose a Different File' : 'Browse Google Drive'}</>
                    )}
                  </Button>
                </>
              )}
            </>
          )}

          {/* ── Local File tab ── */}
          {activeSource === 'local' && (
            <>
              {localFile && (
                <div className="border border-[var(--accent)]/50 bg-[var(--accent)]/5 clip-corner px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="shrink-0 text-red-400" />
                    <span className="truncate font-medium text-sm text-[var(--text)]">{localFile.name}</span>
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-0.5 pl-5">
                    {formatBytes(localFile.size)}
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md,.csv,.rtf,.json"
                className="hidden"
                onChange={handleLocalFileChange}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={parsing}
                className="w-full"
              >
                <Upload size={14} className="mr-2" />
                {localFile ? 'Choose a Different File' : 'Browse Local Files'}
              </Button>
              <p className="text-[10px] text-[var(--muted)]">
                Supports PDF, Word (.docx), plain text, Markdown, CSV
              </p>
            </>
          )}

          {/* Parse button — shared */}
          {canParse && !parsing && (
            <Button onClick={handleParse} className="w-full">
              Parse &ldquo;{activeSource === 'drive' ? selectedFile?.name : localFile?.name}&rdquo;
            </Button>
          )}
        </div>

        {/* ── Results panel ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Parsing state */}
          {parsing && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--muted)]">
              <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
              <p className="text-sm">Claude is reading <span className="text-[var(--text)]">{activeFileName}</span>…</p>
              <p className="text-xs">This usually takes 10–20 seconds</p>
            </div>
          )}

          {/* Parse error */}
          {!parsing && parseError && (
            <div className="bg-red-900/20 border border-red-500/30 px-4 py-3 text-sm text-red-400 clip-corner">
              {parseError}
            </div>
          )}

          {/* Empty state */}
          {!parsing && !parsedData && !parseError && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--muted)]">
              {activeSource === 'drive' ? <FolderOpen size={32} /> : <HardDrive size={32} />}
              <p className="text-sm">
                {canParse
                  ? `Click "Parse" to extract data from this document`
                  : activeSource === 'drive'
                    ? driveStatus === 'disconnected'
                      ? 'Connect Google Drive to browse your documents'
                      : 'Browse Google Drive to select a document'
                    : 'Browse your local files to select a document'}
              </p>
            </div>
          )}

          {/* Parsed results */}
          {!parsing && parsedData && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--muted)]">
                    {selected.size} of {totalItems} selected
                  </span>
                  <button onClick={selectAll} className="text-xs text-[var(--accent)] hover:underline">
                    All
                  </button>
                  <button onClick={deselectAll} className="text-xs text-[var(--muted)] hover:underline">
                    None
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {results.length > 0 && (
                    <span className="text-xs text-green-400">
                      {successCount}/{results.length} imported
                    </span>
                  )}
                  <Button
                    size="sm"
                    onClick={handleImport}
                    disabled={selected.size === 0 || importing}
                  >
                    {importing ? (
                      <><Loader2 size={12} className="animate-spin mr-1" /> Importing…</>
                    ) : (
                      `Import ${selected.size > 0 ? selected.size : ''} selected`
                    )}
                  </Button>
                </div>
              </div>

              {/* Experiences */}
              {parsedData.experiences && parsedData.experiences.length > 0 && (
                <Section title="Experiences" count={parsedData.experiences.length}>
                  {parsedData.experiences.map((exp, i) => {
                    const key = `experiences.${i}`
                    return (
                      <ItemRow key={key} itemKey={key} selected={selected.has(key)} onToggle={toggleKey}
                        imported={importedKeys.has(key)} result={results.find(r => r.key === key)}>
                        <p className="font-medium text-sm text-[var(--text)]">{exp.role}</p>
                        <p className="text-xs text-[var(--accent)]">{exp.company}</p>
                        <p className="text-xs text-[var(--muted)]">
                          {exp.startDate} → {exp.endDate ?? 'Present'}
                          {exp.location && ` · ${exp.location}`}
                        </p>
                        {exp.bullets.length > 0 && (
                          <p className="text-xs text-[var(--muted)] mt-1">{exp.bullets.length} bullet{exp.bullets.length !== 1 ? 's' : ''}</p>
                        )}
                        {exp.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {exp.tags.slice(0, 4).map(t => <Badge key={t} variant="muted">{t}</Badge>)}
                          </div>
                        )}
                      </ItemRow>
                    )
                  })}
                </Section>
              )}

              {/* Education */}
              {parsedData.education && parsedData.education.length > 0 && (
                <Section title="Education" count={parsedData.education.length}>
                  {parsedData.education.map((edu, i) => {
                    const key = `education.${i}`
                    return (
                      <ItemRow key={key} itemKey={key} selected={selected.has(key)} onToggle={toggleKey}
                        imported={importedKeys.has(key)} result={results.find(r => r.key === key)}>
                        <p className="font-medium text-sm text-[var(--text)]">{edu.school}</p>
                        <p className="text-xs text-[var(--muted)]">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
                        <p className="text-xs text-[var(--muted)]">{edu.startDate} → {edu.endDate ?? '—'}</p>
                        {edu.gpa && <p className="text-xs text-[var(--muted)]">GPA: {edu.gpa}</p>}
                        {edu.honors && <p className="text-xs text-[var(--muted)]">{edu.honors}</p>}
                      </ItemRow>
                    )
                  })}
                </Section>
              )}

              {/* Skills */}
              {parsedData.skills && parsedData.skills.length > 0 && (
                <Section title="Skills" count={parsedData.skills.length}>
                  {parsedData.skills.map((skill, i) => {
                    const key = `skills.${i}`
                    return (
                      <ItemRow key={key} itemKey={key} selected={selected.has(key)} onToggle={toggleKey}
                        imported={importedKeys.has(key)} result={results.find(r => r.key === key)}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--text)]">{skill.name}</span>
                          <Badge variant="muted">{skill.group}</Badge>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(n => (
                              <div key={n} className={`w-1.5 h-1.5 rounded-full ${n <= (skill.proficiency ?? 3) ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
                            ))}
                          </div>
                        </div>
                      </ItemRow>
                    )
                  })}
                </Section>
              )}

              {/* Certifications */}
              {parsedData.certifications && parsedData.certifications.length > 0 && (
                <Section title="Certifications" count={parsedData.certifications.length}>
                  {parsedData.certifications.map((cert, i) => {
                    const key = `certifications.${i}`
                    return (
                      <ItemRow key={key} itemKey={key} selected={selected.has(key)} onToggle={toggleKey}
                        imported={importedKeys.has(key)} result={results.find(r => r.key === key)}>
                        <p className="font-medium text-sm text-[var(--text)]">{cert.name}</p>
                        <p className="text-xs text-[var(--muted)]">{cert.issuer} · {cert.date}</p>
                        {cert.expires && <p className="text-xs text-[var(--muted)]">Expires {cert.expires}</p>}
                      </ItemRow>
                    )
                  })}
                </Section>
              )}

              {/* Leadership */}
              {parsedData.leadership && parsedData.leadership.length > 0 && (
                <Section title="Leadership" count={parsedData.leadership.length}>
                  {parsedData.leadership.map((lead, i) => {
                    const key = `leadership.${i}`
                    return (
                      <ItemRow key={key} itemKey={key} selected={selected.has(key)} onToggle={toggleKey}
                        imported={importedKeys.has(key)} result={results.find(r => r.key === key)}>
                        <p className="font-medium text-sm text-[var(--text)]">{lead.role}</p>
                        <p className="text-xs text-[var(--accent)]">{lead.org}</p>
                        <p className="text-xs text-[var(--muted)]">{lead.startDate} → {lead.endDate ?? 'Present'}</p>
                        {lead.bullets.length > 0 && (
                          <p className="text-xs text-[var(--muted)] mt-1">{lead.bullets.length} bullet{lead.bullets.length !== 1 ? 's' : ''}</p>
                        )}
                      </ItemRow>
                    )
                  })}
                </Section>
              )}

              {/* Projects */}
              {parsedData.projects && parsedData.projects.length > 0 && (
                <Section title="Projects" count={parsedData.projects.length}>
                  {parsedData.projects.map((proj, i) => {
                    const key = `projects.${i}`
                    return (
                      <ItemRow key={key} itemKey={key} selected={selected.has(key)} onToggle={toggleKey}
                        imported={importedKeys.has(key)} result={results.find(r => r.key === key)}>
                        <p className="font-medium text-sm text-[var(--text)]">{proj.title}</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{proj.pitch}</p>
                        {proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.techStack.slice(0, 4).map(t => <Badge key={t} variant="cyan">{t}</Badge>)}
                          </div>
                        )}
                      </ItemRow>
                    )
                  })}
                </Section>
              )}

              {totalItems === 0 && (
                <div className="text-center py-8 text-[var(--muted)] text-sm">
                  No structured data found in this document.
                  <br />Try a resume, CV, or project notes document.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
