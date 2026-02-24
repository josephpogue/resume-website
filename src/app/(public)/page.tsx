import { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, Code, Award, Server, ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { deserializeProject } from '@/lib/serialize'
import { AgentCardHero } from '@/components/public/AgentCardHero'
import { MissionCard } from '@/components/public/MissionCard'
import { SectionHeader } from '@/components/public/SectionHeader'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: siteConfig.name,
  description: `${siteConfig.title} — ${siteConfig.tagline}`,
}

const HIGHLIGHT_ICONS = [Briefcase, Code, Award, Server]

export default async function HomePage() {
  const featuredRaw = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { order: 'asc' },
    take: 3,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featured = featuredRaw.map((r: any) => deserializeProject(r))

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <AgentCardHero />

      {/* Stats / Highlights */}
      <section className="relative py-16 border-y border-[var(--border)]">
        <div className="absolute inset-0 bg-[var(--navy)]/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {siteConfig.highlights.map(({ label, value }, i) => {
              const Icon = HIGHLIGHT_ICONS[i] ?? Briefcase
              return (
                <div
                  key={label}
                  className="relative group p-6 border border-[var(--border)] bg-[var(--bg)]/60 hover:border-[var(--accent)]/40 transition-all duration-500"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                >
                  <Icon className="w-5 h-5 text-[var(--accent)]/40 mb-3 group-hover:text-[var(--accent)] transition-colors" />
                  <div
                    className="text-[var(--accent)] mb-1"
                    style={{ fontFamily: 'var(--font-orbitron, sans-serif)', fontSize: '1.8rem' }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-[var(--muted)] tracking-[0.15em]"
                    style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.6rem' }}
                  >
                    {label.toUpperCase()}
                  </div>
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[var(--accent)]/0 group-hover:border-[var(--accent)]/40 transition-colors" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Missions */}
      {featured.length > 0 && (
        <section className="relative py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              label="// OPERATIONS"
              title="Featured Missions"
              subtitle="Selected field operations and projects"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(project => (
                <MissionCard key={project.id} project={project} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/missions"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--text)] transition-colors tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.75rem' }}
              >
                VIEW ALL MISSIONS
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 px-6 border-t border-[var(--border)]">
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-[var(--accent)]" />
            <span
              className="text-[var(--accent)] tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
            >
              // INITIATE CONTACT
            </span>
            <div className="w-8 h-[2px] bg-[var(--accent)]" />
          </div>
          <h2 className="text-[var(--text)] mb-4" style={{ fontSize: '1.75rem' }}>
            Ready to Deploy?
          </h2>
          <p className="text-[var(--muted)] mb-8" style={{ fontSize: '0.95rem' }}>
            Looking for an engineer who treats every system like a mission-critical operation? Let&apos;s connect.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-[var(--accent)] text-white tracking-[0.2em] hover:bg-[var(--accent)]/90 transition-colors"
            style={{
              fontFamily: 'var(--font-rajdhani, sans-serif)',
              fontSize: '0.85rem',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
          >
            START MISSION BRIEFING
          </Link>
        </div>
      </section>
    </div>
  )
}
