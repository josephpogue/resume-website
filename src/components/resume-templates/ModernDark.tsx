import React from 'react'
import type { HtmlTemplateProps } from '@/types'
import { formatDateRange } from '@/lib/utils'

// Valorant design tokens (self-contained — no CSS vars, no Tailwind)
const C = {
  bg:      '#0f1923',
  surface: '#1a2332',
  sidebar: '#111c27',
  darker:  '#0a1017',
  border:  'rgba(255,70,85,0.2)',
  accent:  '#ff4655',
  accent2: '#00ffff',
  text:    '#ece8e1',
  muted:   '#7b8ea0',
}

export function ModernDark({ loadout, siteConfig, photoUrl, fontScale = 1 }: HtmlTemplateProps) {
  // All font sizes run through this helper so binary-search fontScale works
  const fs = (n: number) => `${(n * fontScale).toFixed(2)}px`

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page { size: letter; margin: 0; }

    body {
      background: ${C.bg};
      color: ${C.text};
      font-family: 'Rajdhani', system-ui, sans-serif;
      font-size: ${fs(11)};
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 8.5in;
      min-height: 11in;
      display: grid;
      grid-template-columns: 2.35in 1fr;
      overflow: hidden;
    }

    /* ── Sidebar ── */
    .sidebar {
      background: ${C.sidebar};
      border-right: 1px solid ${C.border};
      padding: 0.32in 0.24in;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .accent-bar {
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, ${C.accent}, transparent);
      flex-shrink: 0;
      margin-bottom: 2px;
    }

    .photo-wrap {
      width: 68px;
      height: 68px;
      border: 2px solid ${C.accent};
      overflow: hidden;
      flex-shrink: 0;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
      margin-bottom: 2px;
    }
    .photo-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .sb-section-title {
      font-family: 'Share Tech Mono', monospace;
      font-size: ${fs(7.5)};
      color: ${C.accent};
      text-transform: uppercase;
      letter-spacing: 2px;
      border-bottom: 1px solid ${C.border};
      padding-bottom: 3px;
      margin-bottom: 7px;
    }

    .skill-group { margin-bottom: 8px; }
    .skill-group-label {
      font-size: ${fs(7.5)};
      color: ${C.muted};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 2px;
    }
    .skill-names { font-size: ${fs(9)}; color: ${C.text}; line-height: 1.5; }

    .edu-entry { margin-bottom: 8px; }
    .edu-school { font-weight: 700; font-size: ${fs(9.5)}; color: ${C.text}; }
    .edu-degree { font-size: ${fs(8.5)}; color: ${C.muted}; margin-top: 1px; }
    .edu-date   { font-size: ${fs(7.5)}; color: ${C.muted}; margin-top: 2px; font-family: 'Share Tech Mono', monospace; }

    .cert-entry { margin-bottom: 7px; }
    .cert-name   { font-size: ${fs(9)}; font-weight: 600; color: ${C.text}; }
    .cert-issuer { font-size: ${fs(8)}; color: ${C.muted}; }
    .cert-date   { font-size: ${fs(7.5)}; color: ${C.muted}; font-family: 'Share Tech Mono', monospace; margin-top: 1px; }

    /* ── Main column ── */
    .main {
      background: ${C.bg};
      padding: 0.32in 0.35in;
      display: flex;
      flex-direction: column;
      gap: 13px;
    }

    /* ── Header ── */
    .header { border-bottom: 2px solid ${C.accent}; padding-bottom: 10px; }
    .header-name {
      font-size: ${fs(22)};
      font-weight: 800;
      color: ${C.text};
      letter-spacing: 1px;
      text-transform: uppercase;
      line-height: 1.1;
    }
    .header-title {
      font-size: ${fs(11)};
      color: ${C.accent};
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-top: 3px;
    }
    .header-contact {
      font-size: ${fs(8.5)};
      color: ${C.muted};
      margin-top: 6px;
      font-family: 'Share Tech Mono', monospace;
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }
    .header-contact span::before {
      content: '//';
      color: ${C.accent};
      margin-right: 4px;
      font-size: ${fs(7)};
    }

    /* ── Section header ── */
    .section-title {
      font-family: 'Share Tech Mono', monospace;
      font-size: ${fs(8)};
      color: ${C.accent};
      text-transform: uppercase;
      letter-spacing: 2px;
      border-bottom: 1px solid ${C.border};
      padding-bottom: 3px;
      margin-bottom: 9px;
    }

    /* ── Experience ── */
    .exp-entry { margin-bottom: 11px; }
    .exp-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .exp-left {}
    .exp-role    { font-size: ${fs(11)}; font-weight: 700; color: ${C.text}; line-height: 1.2; }
    .exp-company { font-size: ${fs(9.5)}; color: ${C.accent}; font-weight: 600; margin-top: 1px; }
    .exp-meta {
      font-size: ${fs(7.5)};
      color: ${C.muted};
      text-align: right;
      font-family: 'Share Tech Mono', monospace;
      white-space: nowrap;
      flex-shrink: 0;
      line-height: 1.5;
    }

    .bullet {
      display: flex;
      gap: 5px;
      font-size: ${fs(9.5)};
      color: ${C.text};
      margin-top: 2.5px;
      line-height: 1.4;
    }
    .bullet-dot { color: ${C.accent}; flex-shrink: 0; font-size: ${fs(11)}; line-height: 1.3; }
    .bullet-metric { color: ${C.accent2}; font-weight: 700; }

    /* ── Projects ── */
    .proj-entry { margin-bottom: 8px; }
    .proj-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    .proj-title { font-size: ${fs(10)}; font-weight: 700; color: ${C.text}; }
    .proj-url   { font-size: ${fs(7.5)}; color: ${C.accent}; font-family: 'Share Tech Mono', monospace; white-space: nowrap; }
    .proj-pitch { font-size: ${fs(9)}; color: ${C.muted}; margin-top: 2px; line-height: 1.4; }
    .proj-stack { font-size: ${fs(8)}; color: ${C.accent2}; margin-top: 2px; font-family: 'Share Tech Mono', monospace; }
  `

  const { experiences, projects, skillGroups, education, certifications } = loadout
  const rules = loadout.loadout.exportRules

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="page">
          {/* ── Sidebar ── */}
          <aside className="sidebar">
            <div className="accent-bar" />

            {photoUrl && (
              <div className="photo-wrap">
                <img src={photoUrl} alt={siteConfig.name} />
              </div>
            )}

            {skillGroups.length > 0 && (
              <div>
                <div className="sb-section-title">Skills</div>
                {skillGroups.map(({ group, skills }) => (
                  <div key={group} className="skill-group">
                    <div className="skill-group-label">{group}</div>
                    <div className="skill-names">{skills.map(s => s.name).join(', ')}</div>
                  </div>
                ))}
              </div>
            )}

            {education.length > 0 && (
              <div>
                <div className="sb-section-title">Education</div>
                {education.map(edu => (
                  <div key={edu.id} className="edu-entry">
                    <div className="edu-school">{edu.school}</div>
                    <div className="edu-degree">
                      {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                      {edu.gpa ? ` · ${edu.gpa}` : ''}
                    </div>
                    <div className="edu-date">{formatDateRange(edu.startDate, edu.endDate)}</div>
                  </div>
                ))}
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <div className="sb-section-title">Certs</div>
                {certifications.map(cert => (
                  <div key={cert.id} className="cert-entry">
                    <div className="cert-name">{cert.name}</div>
                    <div className="cert-issuer">{cert.issuer}</div>
                    <div className="cert-date">{cert.date}</div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* ── Main Column ── */}
          <main className="main">
            <div className="header">
              <div className="header-name">{siteConfig.name}</div>
              <div className="header-title">{siteConfig.title}</div>
              <div className="header-contact">
                <span>{siteConfig.email}</span>
                {siteConfig.socials.linkedin && (
                  <span>{siteConfig.socials.linkedin.replace('https://', '')}</span>
                )}
                {siteConfig.socials.github && (
                  <span>{siteConfig.socials.github.replace('https://', '')}</span>
                )}
              </div>
            </div>

            {experiences.length > 0 && (
              <div>
                <div className="section-title">// Experience</div>
                {experiences.map(exp => {
                  const cap = exp.loadoutItem.bulletCapOverride ?? rules.maxBulletsPerRole
                  const bullets = exp.bullets.slice(0, cap)
                  return (
                    <div key={exp.id} className="exp-entry">
                      <div className="exp-header">
                        <div className="exp-left">
                          <div className="exp-role">{exp.role}</div>
                          <div className="exp-company">{exp.company}</div>
                        </div>
                        <div className="exp-meta">
                          <div>{formatDateRange(exp.startDate, exp.endDate)}</div>
                          {exp.location && <div>{exp.location}</div>}
                        </div>
                      </div>
                      {bullets.map(b => (
                        <div key={b.id} className="bullet">
                          <span className="bullet-dot">›</span>
                          <span>
                            {b.text}
                            {b.metric && (
                              <span className="bullet-metric"> ({b.metric})</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <div className="section-title">// Projects</div>
                {projects.slice(0, rules.maxProjects).map(proj => (
                  <div key={proj.id} className="proj-entry">
                    <div className="proj-header">
                      <div className="proj-title">{proj.title}</div>
                      {proj.githubUrl && (
                        <div className="proj-url">
                          {proj.githubUrl.replace('https://', '')}
                        </div>
                      )}
                    </div>
                    <div className="proj-pitch">{proj.pitch}</div>
                    {proj.techStack.length > 0 && (
                      <div className="proj-stack">
                        {proj.techStack.slice(0, 5).join(' · ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </body>
    </html>
  )
}
