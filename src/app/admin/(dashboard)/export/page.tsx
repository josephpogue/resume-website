'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Download, Layers } from 'lucide-react'
import type { Loadout, TemplateDefinition } from '@/types'

export default function ExportPage() {
  const [loadouts, setLoadouts] = useState<Loadout[]>([])
  const [templates, setTemplates] = useState<TemplateDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/loadouts').then(r => r.json()),
      fetch('/api/templates').then(r => r.json()),
    ]).then(([loadoutData, templateData]) => {
      setLoadouts(loadoutData)
      setTemplates(templateData)
      setLoading(false)
    })
  }, [])

  function getTemplate(templateId: string): TemplateDefinition | undefined {
    return templates.find(t => t.id === templateId)
  }

  async function handleExport(loadout: Loadout) {
    setExporting(loadout.id)
    try {
      const res = await fetch(`/api/pdf/${loadout.id}`)
      if (!res.ok) {
        const err = await res.json()
        alert(`Export failed: ${err.error ?? 'Unknown error'}`)
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${loadout.slug}-${loadout.templateId ?? 'ats-classic'}-resume.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--text)]">
          <span className="neon-red">Export</span>
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">Generate one-page PDFs for each Loadout</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[var(--muted)] text-sm">Loading...</div>
      ) : loadouts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--border)] text-[var(--muted)] text-sm">
          No loadouts yet. Create one in the Loadouts section.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {loadouts.map(loadout => {
            const tmpl = getTemplate(loadout.templateId ?? 'ats-classic')
            const atsColor =
              tmpl?.atsScore === 'high'
                ? 'text-green-400'
                : tmpl?.atsScore === 'medium'
                ? 'text-yellow-400'
                : 'text-[var(--accent)]'

            return (
              <div key={loadout.id} className="bg-[var(--surface)] border border-[var(--border)] p-4 clip-corner">
                <div className="flex items-center gap-2 mb-1">
                  <Layers size={14} className="text-[var(--accent)]" />
                  <span className="font-semibold text-sm text-[var(--text)]">{loadout.name}</span>
                  {loadout.isDefault && <Badge variant="accent">Default</Badge>}
                </div>

                {/* Template badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-[var(--muted)] bg-[var(--bg)] px-1.5 py-0.5 border border-[var(--border)]">
                    {tmpl?.name ?? loadout.templateId}
                  </span>
                  {tmpl && (
                    <span className={`text-[10px] font-mono ${atsColor}`}>
                      ATS: {tmpl.atsScore}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--muted)] font-mono mb-4">/{loadout.slug}</p>

                <div className="space-y-1 text-xs text-[var(--muted)] mb-4">
                  <div>Max bullets/role: <span className="text-[var(--text)]">{loadout.exportRules.maxBulletsPerRole}</span></div>
                  <div>Max projects: <span className="text-[var(--text)]">{loadout.exportRules.maxProjects}</span></div>
                  <div>Font scale: <span className="text-[var(--text)]">{loadout.exportRules.fontScaleRange[0]}–{loadout.exportRules.fontScaleRange[1]}</span></div>
                </div>

                <Button
                  onClick={() => handleExport(loadout)}
                  disabled={exporting === loadout.id}
                  className="w-full"
                  size="sm"
                >
                  <Download size={12} className="mr-1.5" />
                  {exporting === loadout.id ? 'Generating...' : 'Export 1-Page PDF'}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
