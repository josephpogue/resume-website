import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { deserializeProject } from '@/lib/serialize'
import { MissionCard } from '@/components/public/MissionCard'
import { TacticalGrid } from '@/components/public/TacticalGrid'

export const metadata: Metadata = { title: 'Missions' }

export default async function MissionsPage() {
  const rows = await prisma.project.findMany({
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = rows.map((r: any) => deserializeProject(r))

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="relative py-16 border-b border-[var(--border)] overflow-hidden">
        <TacticalGrid />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] to-[var(--navy)]/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Player mode header */}
          <div className="player-only">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[var(--accent)]" />
              <span
                className="text-[var(--accent)] tracking-[0.3em] uppercase"
                style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
              >
                // OPERATIONS LOG
              </span>
            </div>
            <h1 className="text-[var(--text)] mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
              Mission <span className="text-[var(--accent)]">Log</span>
            </h1>
            <p className="text-[var(--muted)]" style={{ fontSize: '0.95rem' }}>
              Projects, case studies, and open-source operations
            </p>
          </div>
          {/* Career mode header */}
          <div className="career-only">
            <p
              className="text-[var(--accent)] mb-3 font-semibold tracking-wide"
              style={{ fontSize: '0.875rem' }}
            >
              PORTFOLIO
            </p>
            <h1 className="text-[var(--text)] mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
              Projects
            </h1>
            <p className="text-[var(--muted)]" style={{ fontSize: '0.95rem' }}>
              Selected projects, open-source work, and case studies
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p
              className="text-[var(--muted)]"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.85rem' }}
            >
              NO MISSIONS LOGGED YET.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <MissionCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
