import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deserializeProject } from '@/lib/serialize'
import { Badge } from '@/components/ui/Badge'
import { Github, ExternalLink, ArrowLeft } from 'lucide-react'

export default async function MissionDetailPage({ params }: { params: { slug: string } }) {
  const raw = await prisma.project.findUnique({ where: { slug: params.slug } })
  if (!raw) notFound()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = deserializeProject(raw as any)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/missions" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-8">
        <ArrowLeft size={14} /> Back to Missions
      </Link>

      <div className="mb-8">
        {project.featured && (
          <Badge variant="accent" className="mb-3">FEATURED</Badge>
        )}
        <h1 className="text-3xl font-black text-[var(--text)] mb-3">{project.title}</h1>
        <p className="text-lg text-[var(--muted)]">{project.pitch}</p>
      </div>

      {/* Links */}
      <div className="flex gap-4 mb-8">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors clip-corner-sm">
            <Github size={14} /> GitHub
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-sm text-[var(--text)] hover:border-[var(--accent2)] hover:text-[var(--accent2)] transition-colors clip-corner-sm">
            <ExternalLink size={14} /> Live Demo
          </a>
        )}
      </div>

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-2">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map(tech => <Badge key={tech} variant="cyan">{tech}</Badge>)}
          </div>
        </div>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-1">
            {project.tags.map(tag => <Badge key={tag} variant="muted">{tag}</Badge>)}
          </div>
        </div>
      )}

      {/* Case Study */}
      {project.casestudy ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 clip-corner">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[var(--muted)] mb-4">Case Study</h2>
          <div className="prose prose-sm prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-[var(--text)] font-sans leading-relaxed">
              {project.casestudy}
            </pre>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted)] text-sm border border-dashed border-[var(--border)]">
          Case study coming soon.
        </div>
      )}
    </div>
  )
}
