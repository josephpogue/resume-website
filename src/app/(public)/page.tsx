import { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, Code, Award, Server, ChevronRight, Target, Zap, Clock, Github, Linkedin } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { deserializeProject } from '@/lib/serialize'
import { AgentCardHero } from '@/components/public/AgentCardHero'
import { MissionCard } from '@/components/public/MissionCard'
import { SectionHeader } from '@/components/public/SectionHeader'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.tagline || siteConfig.name,
}

const HIGHLIGHT_ICONS = [Briefcase, Code, Award, Server]
const PLAYER_ICONS = [Target, Zap, Clock]

function CareerHero({ title }: { title: string }) {
  return (
    <section className="relative border-b border-[var(--border)]">
      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">

          {/* Left: main content */}
          <div className="flex-1">
            <p
              className="text-[var(--accent)] mb-4 font-semibold tracking-wide"
              style={{ fontSize: '0.875rem' }}
            >
              Available for opportunities
            </p>
            <h1
              className="text-[var(--text)] mb-4"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1 }}
            >
              {siteConfig.name.split(' ')[0]}{' '}
              <span className="text-[var(--accent)]">
                {siteConfig.name.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            {title && (
              <p
                className="text-[var(--muted)] mb-3 font-medium"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
              >
                {title}
              </p>
            )}
            {siteConfig.tagline && (
              <p className="text-[var(--muted)]/80 max-w-lg mb-8" style={{ fontSize: '1rem' }}>
                {siteConfig.tagline}
              </p>
            )}
            <div className="flex flex-wrap gap-4 mb-8">
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
            <div className="flex items-center gap-6 pt-6 border-t border-[var(--border)]">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                style={{ fontSize: '0.875rem' }}
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                style={{ fontSize: '0.875rem' }}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Right: quick-links card */}
          <div className="hidden lg:flex flex-col gap-3 w-64 shrink-0">
            <p className="text-[var(--muted)] mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
              QUICK LINKS
            </p>
            {[
              { label: 'Resume', href: '/resume' },
              { label: 'Projects', href: '/missions' },
              { label: 'Loadout', href: '/loadout' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-4 py-3 border border-[var(--border)] bg-[var(--surface)] rounded hover:border-[var(--accent)]/40 hover:text-[var(--accent)] text-[var(--muted)] transition-all group"
                style={{ fontSize: '0.875rem' }}
              >
                {label}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

function parseYear(dateStr: string): number | null {
  const d = new Date(dateStr)
  if (!isNaN(d.getTime())) return d.getFullYear()
  const match = dateStr.match(/\b(19|20)\d{2}\b/)
  return match ? parseInt(match[0]) : null
}

export default async function HomePage() {
  const [featuredRaw, projectCount, certCount, skillCount, allExperiences] = await Promise.all([
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      take: 3,
    }),
    prisma.project.count(),
    prisma.certification.count(),
    prisma.skill.count(),
    prisma.experience.findMany({ select: { startDate: true, role: true } }),
  ])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featured = featuredRaw.map((r: any) => deserializeProject(r))

  let yearsOfExperience = 0
  let currentTitle = ''
  if (allExperiences.length > 0) {
    const parsed = allExperiences
      .map(e => ({ role: e.role, year: parseYear(e.startDate) }))
      .filter((e): e is { role: string; year: number } => e.year !== null)
    if (parsed.length > 0) {
      const earliest = Math.min(...parsed.map(e => e.year))
      yearsOfExperience = new Date().getFullYear() - earliest
      const latest = parsed.reduce((a, b) => (b.year > a.year ? b : a))
      currentTitle = latest.role
    }
  }

  const highlights = [
    { label: 'Years of Experience', value: yearsOfExperience === 0 ? '0' : `${yearsOfExperience}+` },
    { label: 'Projects Shipped', value: String(projectCount) },
    { label: 'Certifications', value: String(certCount) },
  ]

  const playerHighlights = [
    { label: 'Operations Completed', value: String(projectCount) },
    { label: 'Skills Mastered', value: String(skillCount) },
    { label: 'Years in Field', value: yearsOfExperience === 0 ? '0' : String(yearsOfExperience) },
  ]

  return (
    <div className="overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="player-only">
        <AgentCardHero title={currentTitle} />
      </div>
      <div className="career-only">
        <CareerHero title={currentTitle} />
      </div>

      {/* ── Player Bio Card ────────────────────────────────────────── */}
      {(siteConfig.player.agentClass || siteConfig.player.bio) && (
        <div className="player-only border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div
              className="relative border border-[var(--accent)]/20 bg-[var(--surface)]/60 p-6 flex flex-col sm:flex-row gap-6 items-start"
              style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}
            >
              {/* Accent corner */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--accent)]/60" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--accent)]/60" />
              <div className="flex-1">
                {siteConfig.player.agentClass && (
                  <div
                    className="text-[var(--accent)] tracking-[0.25em] mb-2"
                    style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
                  >
                    // {siteConfig.player.agentClass.toUpperCase()}
                  </div>
                )}
                {siteConfig.player.bio && (
                  <p
                    className="text-[var(--muted)] leading-relaxed"
                    style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '1rem' }}
                  >
                    {siteConfig.player.bio}
                  </p>
                )}
              </div>
              <Link
                href="/hobbies"
                className="shrink-0 self-end sm:self-center flex items-center gap-2 text-[var(--accent)] hover:text-[var(--text)] transition-colors tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
              >
                VIEW DOSSIER
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

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
            {playerHighlights.map(({ label, value }, i) => {
              const Icon = PLAYER_ICONS[i] ?? Target
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
            {highlights.map(({ label, value }, i) => {
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
