import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'
import type { Project } from '@/types'

interface Props {
  project: Project
  compact?: boolean
}

export function MissionCard({ project, compact = false }: Props) {
  const codename = `OPERATION: ${project.title.toUpperCase().split(' ').slice(0, 2).join('-')}`

  return (
    <div className="group relative border border-[var(--border)] bg-[var(--navy)]/20 hover:border-[var(--accent)]/40 transition-all duration-500 overflow-hidden flex flex-col">

      {/* Header bar */}
      <div className="px-5 py-3 bg-[var(--accent)]/5 border-b border-[var(--border)] flex items-center justify-between">
        <span
          className="text-[var(--accent)] tracking-[0.2em] truncate"
          style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
        >
          {codename}
        </span>
        {project.featured && (
          <span
            className="shrink-0 ml-2 px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30"
            style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.55rem' }}
          >
            FEATURED
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <Link
          href={`/missions/${project.slug}`}
          className="text-[var(--text)] hover:text-[var(--accent)] transition-colors mb-2 leading-snug"
          style={{ fontSize: '1.05rem', fontFamily: 'var(--font-rajdhani, sans-serif)', fontWeight: 600 }}
        >
          {project.title}
        </Link>

        <p
          className={`text-[var(--muted)]/70 mb-4 flex-1 ${compact ? 'line-clamp-1' : 'line-clamp-2'}`}
          style={{ fontSize: '0.875rem' }}
        >
          {project.pitch}
        </p>

        {/* Tech stack */}
        {!compact && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.techStack.slice(0, 5).map(tech => (
              <span
                key={tech}
                className="text-[var(--muted)]/60"
                style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.6rem' }}
              >
                #{tech}
              </span>
            ))}
            {project.techStack.length > 5 && (
              <span
                className="text-[var(--muted)]/40"
                style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.6rem' }}
              >
                +{project.techStack.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
            >
              <Github size={12} /> GITHUB
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[var(--muted)] hover:text-[var(--accent2)] transition-colors"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
            >
              <ExternalLink size={12} /> DEMO
            </a>
          )}
          <Link
            href={`/missions/${project.slug}`}
            className="ml-auto text-[var(--muted)] hover:text-[var(--accent)] transition-colors opacity-0 group-hover:opacity-100"
            style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
          >
            INTEL →
          </Link>
        </div>
      </div>

      {/* Bottom gradient accent on hover */}
      <div className="h-[2px] bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)] to-[var(--accent)]/0 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

      {/* Left accent line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]/0 group-hover:bg-[var(--accent)] transition-colors duration-500" />
    </div>
  )
}
