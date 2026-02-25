import { Metadata } from 'next'
import { TacticalGrid } from '@/components/public/TacticalGrid'
import { SectionHeader } from '@/components/public/SectionHeader'

export const metadata: Metadata = { title: 'Hobbies' }

// TODO: Replace with your actual hobbies and interests
const hobbies = [
  {
    title: '[ HOBBY NAME ]',
    label: '// CATEGORY',
    description: "[ Describe this hobby — what you enjoy about it, how long you've been doing it, any notable experiences. ]",
    tags: ['TAG1', 'TAG2', 'TAG3'],
  },
  {
    title: '[ HOBBY NAME ]',
    label: '// CATEGORY',
    description: "[ Describe this hobby. ]",
    tags: ['TAG1', 'TAG2'],
  },
  {
    title: '[ HOBBY NAME ]',
    label: '// CATEGORY',
    description: "[ Describe this hobby. ]",
    tags: ['TAG1'],
  },
]

export default function HobbiesPage() {
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="relative py-16 border-b border-[var(--border)] overflow-hidden">
        <TacticalGrid />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] to-[var(--navy)]/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-[var(--accent)]" />
            <span
              className="text-[var(--accent)] tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
            >
              // OFF-DUTY ACTIVITIES
            </span>
          </div>
          <h1 className="text-[var(--text)] mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
            Hobbies &amp; <span className="text-[var(--accent)]">Interests</span>
          </h1>
          <p className="text-[var(--muted)]" style={{ fontSize: '0.95rem' }}>
            What I do when I&apos;m not deploying infrastructure
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionHeader
          label="// PERSONAL LOG"
          title="Off-Duty Activities"
          subtitle="Beyond the terminal"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hobbies.map((hobby, i) => (
            <div
              key={i}
              className="group relative border border-[var(--border)] bg-[var(--navy)]/20 hover:border-[var(--accent)]/40 transition-all duration-500 overflow-hidden flex flex-col p-5"
            >
              <div
                className="text-[var(--accent)] tracking-[0.2em] mb-2"
                style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
              >
                {hobby.label}
              </div>
              <h3
                className="text-[var(--text)] mb-3"
                style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '1.15rem', fontWeight: 600 }}
              >
                {hobby.title}
              </h3>
              <p
                className="text-[var(--muted)]/70 mb-4 flex-1"
                style={{ fontSize: '0.875rem' }}
              >
                {hobby.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {hobby.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[var(--muted)]/60"
                    style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.6rem' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              {/* Hover accents */}
              <div className="h-[2px] bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)] to-[var(--accent)]/0 opacity-0 group-hover:opacity-70 transition-opacity duration-500 mt-4" />
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]/0 group-hover:bg-[var(--accent)] transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
