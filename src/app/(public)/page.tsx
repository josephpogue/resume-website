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

function CareerHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center border-b border-[var(--border)]">
      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-3xl">
          <p
            className="text-[var(--accent)] mb-4 font-semibold tracking-wide"
            style={{ fontSize: '0.875rem' }}
          >
            Available for opportunities
          </p>
          <h1
            className="text-[var(--text)] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1 }}
          >
            {siteConfig.name.split(' ')[0]}{' '}
            <span className="text-[var(--accent)]">
              {siteConfig.name.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p
            className="text-[var(--muted)] mb-4 font-medium"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
          >
            {siteConfig.title}
          </p>
          <p className="text-[var(--muted)]/80 max-w-lg mb-10" style={{ fontSize: '1rem' }}>
            {siteConfig.tagline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/resume"
              className="px-8 py-3 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent)]/90 transition-colors font-medium"
              style={{ fontSize: '0.95rem' }}
            >
              View Resume
            </Link>
            <Link
              href="/missions"
              className="px-8 py-3 border border-[var(--accent)]/40 text-[var(--accent)] rounded hover:bg-[var(--accent)]/10 transition-colors"
              style={{ fontSize: '0.95rem' }}
            >
              See Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

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

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="player-only">
        <AgentCardHero />
      </div>
      <div className="career-only">
        <CareerHero />
      </div>

      {/* ── Stats / Highlights ─────────────────────────────────────── */}

      {/* Player mode stats */}
      <section className="player-only relative py-16 border-y border-[var(--border)]">
        <div className="absolute inset-0 bg-[var(--navy)]/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <span
              className="text-[var(--accent)] tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
            >
              // OPERATOR STATISTICS
            </span>
          </div>
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
                  <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[var(--accent)]/0 group-hover:border-[var(--accent)]/40 transition-colors" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Career mode stats */}
      <section className="career-only relative py-16 border-y border-[var(--border)]">
        <div className="relative max-w-7xl mx-auto px-6">
          <h2 className="text-[var(--text)] mb-8" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            At a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {siteConfig.highlights.map(({ label, value }, i) => {
              const Icon = HIGHLIGHT_ICONS[i] ?? Briefcase
              return (
                <div
                  key={label}
                  className="p-6 border border-[var(--border)] bg-[var(--surface)] rounded-lg hover:border-[var(--accent)]/40 transition-all duration-300"
                >
                  <Icon className="w-5 h-5 text-[var(--accent)] mb-3" />
                  <div
                    className="text-[var(--accent)] font-bold mb-1"
                    style={{ fontSize: '2rem' }}
                  >
                    {value}
                  </div>
                  <div className="text-[var(--muted)]" style={{ fontSize: '0.875rem' }}>
                    {label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ──────────────────────────────────────── */}

      {/* Player mode: Featured Missions */}
      {featured.length > 0 && (
        <section className="player-only relative py-24 px-6">
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

      {/* Career mode: Featured Projects */}
      {featured.length > 0 && (
        <section className="career-only relative py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              label="SELECTED WORK"
              title="Featured Projects"
              subtitle="A selection of recent work and open-source contributions"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(project => (
                <MissionCard key={project.id} project={project} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/missions"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--text)] transition-colors"
                style={{ fontSize: '0.875rem' }}
              >
                View All Projects
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────── */}

      {/* Player mode CTA */}
      <section className="player-only relative py-24 px-6 border-t border-[var(--border)]">
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

      {/* Career mode CTA */}
      <section className="career-only relative py-24 px-6 border-t border-[var(--border)]">
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-[var(--text)] mb-4" style={{ fontSize: '1.75rem' }}>
            Let&apos;s Work Together
          </h2>
          <p className="text-[var(--muted)] mb-8" style={{ fontSize: '0.95rem' }}>
            Open to new opportunities, collaborations, and interesting engineering challenges.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent)]/90 transition-colors font-medium"
            style={{ fontSize: '0.95rem' }}
          >
            Get in Touch
          </Link>
        </div>
      </section>

    </div>
  )
}
