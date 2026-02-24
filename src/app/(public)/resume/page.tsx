import { Metadata } from 'next'
import { Suspense } from 'react'
import { listLoadouts, resolveLoadout } from '@/lib/loadout-resolver'
import { LoadoutSelector } from '@/components/public/LoadoutSelector'
import { formatDateRange } from '@/lib/utils'
import { Download, Github, ExternalLink, Briefcase } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = { title: 'Resume' }

interface ResumePageProps {
  searchParams: { loadout?: string }
}

function ResumeSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-6 h-[2px] bg-[var(--accent)]" />
        <span
          className="text-[var(--accent)] tracking-[0.25em] uppercase"
          style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
        >
          {label}
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      {children}
    </section>
  )
}

export default async function ResumePage({ searchParams }: ResumePageProps) {
  const loadouts = await listLoadouts()
  const defaultLoadout = loadouts.find(l => l.isDefault) ?? loadouts[0]
  const activeSlug = searchParams.loadout ?? defaultLoadout?.slug ?? ''

  const resolved = activeSlug ? await resolveLoadout(activeSlug) : null

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10 pb-8 border-b border-[var(--border)]">
        <div>
          <h1
            className="text-[var(--accent)] mb-1"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
          >
            {siteConfig.name}
          </h1>
          <p
            className="text-[var(--muted)] tracking-[0.1em]"
            style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.8rem' }}
          >
            {siteConfig.title}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Suspense fallback={null}>
            <LoadoutSelector loadouts={loadouts} activeSlug={activeSlug} />
          </Suspense>
          {resolved && (
            <a
              href={`/api/pdf/${resolved.loadout.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-white tracking-[0.1em] hover:bg-[var(--accent)]/90 transition-colors"
              style={{
                fontFamily: 'var(--font-mono-val, monospace)',
                fontSize: '0.7rem',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}
            >
              <Download size={12} /> PDF
            </a>
          )}
        </div>
      </div>

      {!resolved ? (
        <div className="text-center py-20">
          <p
            className="text-[var(--muted)]"
            style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.85rem' }}
          >
            {loadouts.length === 0
              ? 'NO LOADOUTS CONFIGURED YET.'
              : 'SELECT A LOADOUT TO VIEW RESUME.'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">

          {/* Education */}
          {resolved.education.length > 0 && (
            <ResumeSection label="// Education">
              <div className="space-y-4">
                {resolved.education.map(edu => (
                  <div key={edu.id} className="group relative p-4 border border-[var(--border)] bg-[var(--surface)]/20 hover:border-[var(--accent)]/30 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <div
                          className="text-[var(--text)] font-semibold"
                          style={{ fontSize: '0.95rem' }}
                        >
                          {edu.school}
                        </div>
                        <div className="text-[var(--muted)] mt-0.5" style={{ fontSize: '0.875rem' }}>
                          {edu.degree}{edu.field && `, ${edu.field}`}
                        </div>
                        {edu.gpa && (
                          <div
                            className="text-[var(--muted)]/60 mt-0.5"
                            style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
                          >
                            GPA: {edu.gpa}
                          </div>
                        )}
                      </div>
                      <div
                        className="text-[var(--muted)] shrink-0 ml-4"
                        style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
                      >
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </div>
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]/0 group-hover:bg-[var(--accent)] transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Skills */}
          {resolved.skillGroups.length > 0 && (
            <ResumeSection label="// Loadout / Skills">
              <div className="space-y-3">
                {resolved.skillGroups.map(({ group, skills }) => (
                  <div key={group} className="flex gap-4 items-start">
                    <span
                      className="text-[var(--muted)] shrink-0 w-32"
                      style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
                    >
                      {group}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(s => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--text)] transition-colors"
                          style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Certifications */}
          {resolved.certifications.length > 0 && (
            <ResumeSection label="// Certifications">
              <div className="flex flex-wrap gap-3">
                {resolved.certifications.map(cert => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-2 px-3 py-2 border border-[var(--border)] bg-[var(--surface)]/20"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                  >
                    {cert.credUrl ? (
                      <a
                        href={cert.credUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline"
                        style={{ fontSize: '0.85rem' }}
                      >
                        {cert.name}
                      </a>
                    ) : (
                      <span className="text-[var(--text)]" style={{ fontSize: '0.85rem' }}>{cert.name}</span>
                    )}
                    <span
                      className="text-[var(--muted)]"
                      style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
                    >
                      · {cert.issuer} · {cert.date}
                    </span>
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Experience */}
          {resolved.experiences.length > 0 && (
            <ResumeSection label="// Combat Record / Experience">
              <div className="space-y-6">
                {resolved.experiences.map(exp => {
                  const bulletCap = exp.loadoutItem.bulletCapOverride
                    ?? (resolved.loadout.exportRules.maxBulletsPerRole ?? 10)
                  const visibleBullets = exp.bullets.slice(0, bulletCap)

                  return (
                    <div
                      key={exp.id}
                      className="group relative p-5 border border-[var(--border)] bg-[var(--surface)]/10 hover:border-[var(--accent)]/30 transition-all duration-300"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <div className="text-[var(--text)] font-semibold" style={{ fontSize: '1rem' }}>
                            {exp.role}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Briefcase className="w-3 h-3 text-[var(--accent)]" />
                            <span className="text-[var(--accent)]" style={{ fontSize: '0.875rem' }}>
                              {exp.company}
                            </span>
                          </div>
                        </div>
                        <div
                          className="text-[var(--muted)] shrink-0"
                          style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
                        >
                          <div>{formatDateRange(exp.startDate, exp.endDate)}</div>
                          {exp.location && <div className="text-right">{exp.location}</div>}
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {visibleBullets.map(b => (
                          <li
                            key={b.id}
                            className="text-[var(--muted)] pl-4 border-l-2 border-[var(--border)] leading-relaxed"
                            style={{ fontSize: '0.875rem' }}
                          >
                            {b.text}
                            {b.metric && (
                              <span className="ml-1 text-[var(--accent)] font-semibold">({b.metric})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]/0 group-hover:bg-[var(--accent)] transition-colors duration-300" />
                    </div>
                  )
                })}
              </div>
            </ResumeSection>
          )}

          {/* Projects */}
          {resolved.projects.length > 0 && (
            <ResumeSection label="// Operations / Projects">
              <div className="space-y-3">
                {resolved.projects.map(proj => (
                  <div key={proj.id} className="group flex items-start gap-4 p-4 border border-[var(--border)] bg-[var(--surface)]/10 hover:border-[var(--accent)]/30 transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[var(--text)] font-semibold" style={{ fontSize: '0.95rem' }}>
                          {proj.title}
                        </span>
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                          >
                            <Github size={12} />
                          </a>
                        )}
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--muted)] hover:text-[var(--accent2)] transition-colors"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <p className="text-[var(--muted)] mb-2" style={{ fontSize: '0.8rem' }}>{proj.pitch}</p>
                      <div className="flex flex-wrap gap-2">
                        {proj.techStack.slice(0, 4).map(t => (
                          <span
                            key={t}
                            className="px-2 py-0.5 border border-[var(--border)] text-[var(--muted)]"
                            style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.6rem' }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Leadership */}
          {resolved.leadership.length > 0 && (
            <ResumeSection label="// Leadership">
              <div className="space-y-4">
                {resolved.leadership.map(lead => (
                  <div key={lead.id} className="group relative p-4 border border-[var(--border)] bg-[var(--surface)]/10 hover:border-[var(--accent)]/30 transition-all">
                    <div className="flex justify-between mb-2">
                      <div>
                        <div className="text-[var(--text)] font-semibold" style={{ fontSize: '0.95rem' }}>
                          {lead.role}
                        </div>
                        <div className="text-[var(--muted)]" style={{ fontSize: '0.875rem' }}>{lead.org}</div>
                      </div>
                      <div
                        className="text-[var(--muted)] shrink-0 ml-4"
                        style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
                      >
                        {formatDateRange(lead.startDate, lead.endDate)}
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {lead.bullets.slice(0, 3).map((b, i) => (
                        <li
                          key={i}
                          className="text-[var(--muted)] pl-3 border-l border-[var(--border)]"
                          style={{ fontSize: '0.8rem' }}
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]/0 group-hover:bg-[var(--accent)] transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}
        </div>
      )}
    </div>
  )
}
