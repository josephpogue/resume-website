import { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import { Mail, Github, Linkedin } from 'lucide-react'
import { TacticalGrid } from '@/components/public/TacticalGrid'

export const metadata: Metadata = { title: 'Contact' }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOCIAL_ICONS: Record<string, React.ComponentType<any>> = {
  github:   Github,
  linkedin: Linkedin,
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="relative py-16 border-b border-[var(--border)] overflow-hidden">
        <TacticalGrid />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] to-[var(--navy)]/20" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-[var(--accent)]" />
            <span
              className="text-[var(--accent)] tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
            >
              // INITIATE CONTACT
            </span>
            <div className="w-8 h-[2px] bg-[var(--accent)]" />
          </div>
          <h1 className="text-[var(--text)] mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
            Start a <span className="text-[var(--accent)]">Mission Briefing</span>
          </h1>
          <p className="text-[var(--muted)] max-w-md mx-auto" style={{ fontSize: '0.95rem' }}>
            Open to new opportunities, collaborations, and interesting engineering problems.
          </p>
        </div>
      </div>

      {/* Contact content */}
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">

        {/* Email CTA */}
        <a
          href={`mailto:${siteConfig.email}`}
          className="group inline-flex items-center gap-4 px-10 py-5 border border-[var(--border)] bg-[var(--surface)]/40 hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/5 transition-all duration-300 mb-16"
          style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
        >
          <Mail
            size={18}
            className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors"
          />
          <span
            className="text-[var(--text)] group-hover:text-[var(--accent)] transition-colors"
            style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.9rem' }}
          >
            {siteConfig.email}
          </span>
        </a>

        {/* Section label */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-px bg-[var(--border)]" />
          <span
            className="text-[var(--muted)] tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
          >
            SECURE CHANNELS
          </span>
          <div className="w-12 h-px bg-[var(--border)]" />
        </div>

        {/* Socials */}
        <div className="flex items-center justify-center gap-6">
          {Object.entries(siteConfig.socials).map(([key, url]) => {
            const Icon = SOCIAL_ICONS[key] ?? Mail
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-6 border border-[var(--border)] bg-[var(--surface)]/20 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all duration-300 w-32"
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
              >
                <Icon
                  size={22}
                  className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors"
                />
                <span
                  className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.6rem' }}
                >
                  {key}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
