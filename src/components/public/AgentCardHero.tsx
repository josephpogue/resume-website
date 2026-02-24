import Link from 'next/link'
import { ChevronRight, Terminal, Github, Linkedin, ExternalLink } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { TacticalGrid } from '@/components/public/TacticalGrid'

export function AgentCardHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <TacticalGrid />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] via-[var(--bg)] to-[var(--navy)]/30" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-3xl">

          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-[var(--accent)]/30 bg-[var(--accent)]/5 anim-fade-up"
            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span
              className="text-[var(--accent)] tracking-[0.25em]"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.7rem' }}
            >
              AVAILABLE FOR OPPORTUNITIES
            </span>
          </div>

          {/* Name */}
          <div className="anim-fade-up anim-delay-1">
            <h1
              className="text-[var(--text)]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.05 }}
            >
              <span className="text-[var(--text)]">{siteConfig.name.split(' ')[0]}</span>
              <br />
              <span className="text-[var(--accent)]">{siteConfig.name.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3 mt-4 mb-4 anim-fade-up anim-delay-2">
            <ChevronRight className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span
              className="text-[var(--muted)] tracking-[0.15em]"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: 'clamp(0.85rem, 2vw, 1.05rem)' }}
            >
              {siteConfig.title}
            </span>
          </div>

          {/* Tagline */}
          <p
            className="text-[var(--muted)]/80 max-w-lg mb-8 anim-fade-up anim-delay-3"
            style={{ fontSize: '1rem', fontFamily: 'var(--font-rajdhani, sans-serif)' }}
          >
            {siteConfig.tagline} Turning complex infrastructure challenges into elegant, battle-tested solutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 anim-fade-up anim-delay-4">
            <Link
              href="/resume"
              className="px-8 py-3 bg-[var(--accent)] text-white tracking-[0.2em] hover:bg-[var(--accent)]/90 transition-colors"
              style={{
                fontFamily: 'var(--font-rajdhani, sans-serif)',
                fontSize: '0.85rem',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
            >
              VIEW RESUME
            </Link>
            <Link
              href="/missions"
              className="px-8 py-3 border border-[var(--accent)]/40 text-[var(--accent)] tracking-[0.2em] hover:bg-[var(--accent)]/10 transition-colors"
              style={{
                fontFamily: 'var(--font-rajdhani, sans-serif)',
                fontSize: '0.85rem',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
            >
              SEE MISSIONS
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6 mt-10 anim-fade-up anim-delay-5">
            {Object.entries(siteConfig.socials).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                {key === 'github' && <Github className="w-4 h-4" />}
                {key === 'linkedin' && <Linkedin className="w-4 h-4" />}
                {key !== 'github' && key !== 'linkedin' && <ExternalLink className="w-4 h-4" />}
                <span
                  className="tracking-widest"
                  style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
                >
                  {key.toUpperCase()}
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>

        {/* Decorative HUD element — desktop only */}
        <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2">
          <div className="relative w-72 h-72 anim-fade-up anim-delay-3">
            {/* Rotating outer ring */}
            <div
              className="absolute inset-0 border border-[var(--accent)]/20 rounded-full"
              style={{ animation: 'spin-slow 30s linear infinite' }}
            />
            {/* Counter-rotating inner dashed ring */}
            <div
              className="absolute inset-4 border border-[var(--accent)]/10 rounded-full"
              style={{
                borderStyle: 'dashed',
                animation: 'spin-slow-reverse 20s linear infinite',
              }}
            />
            {/* Inner content */}
            <div className="absolute inset-12 flex items-center justify-center">
              <div className="text-center">
                <Terminal className="w-10 h-10 text-[var(--accent)] mx-auto mb-2 opacity-60" />
                <div
                  className="text-[var(--accent)]/60 tracking-[0.2em]"
                  style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.6rem' }}
                >
                  AGENT PROFILE
                </div>
                <div
                  className="text-[var(--muted)]/40 tracking-widest mt-1"
                  style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.5rem' }}
                >
                  SENTINEL CLASS
                </div>
              </div>
            </div>
            {/* Corner markers */}
            {[0, 90, 180, 270].map((deg, i) => (
              <div
                key={deg}
                className="absolute w-3 h-3 border-t-2 border-l-2 border-[var(--accent)]/40"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translate(130px, -6px)`,
                  animation: `cornerBlink 2s ease-in-out ${i * 0.5}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
