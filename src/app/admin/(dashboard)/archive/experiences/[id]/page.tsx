import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deserializeExperience, deserializeBullet } from '@/lib/serialize'
import { BulletBankEditor } from '@/components/admin/BulletBankEditor'
import { formatDateRange } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export default async function ExperienceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const raw = await prisma.experience.findUnique({
    where: { id: params.id },
    include: { bullets: { orderBy: { order: 'asc' } } },
  })
  if (!raw) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exp = deserializeExperience(raw as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bullets = raw.bullets.map((b: any) => deserializeBullet(b))

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <Link href="/admin/archive" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">
        <ArrowLeft size={14} /> Back to Archive
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--text)]">
          {exp.role} <span className="text-[var(--accent)]">@ {exp.company}</span>
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {formatDateRange(exp.startDate, exp.endDate)}
          {exp.location && ` · ${exp.location}`}
        </p>
      </div>

      {/* Bullet Bank */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-4 clip-corner">
        <BulletBankEditor experienceId={exp.id} initialBullets={bullets} />
      </div>

      {/* Private notes */}
      {exp.description && (
        <div className="bg-[var(--surface)] border border-[var(--border)] p-4">
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">Private Notes</h3>
          <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{exp.description}</p>
        </div>
      )}
    </div>
  )
}
