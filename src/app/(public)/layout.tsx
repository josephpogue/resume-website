'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Crosshair, Menu, X, Github, Linkedin } from 'lucide-react'
import { ProfileModeToggle } from '@/components/public/ProfileModeToggle'
import { useProfileMode } from '@/hooks/useProfileMode'
import { siteConfig } from '@/lib/site-config'

interface NavbarProps {
  careerMode: boolean
  toggle: () => void
}

function Navbar({ careerMode, toggle }: NavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = careerMode
    ? [
        { href: '/resume',   label: 'RESUME' },
        { href: '/missions', label: 'PROJECTS' },
        { href: '/contact',  label: 'CONTACT' },
      ]
    : [
        { href: '/loadout',  label: 'LOADOUT' },
        { href: '/hobbies',  label: 'HOBBIES' },
        { href: '/contact',  label: 'CONTACT' },
      ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Red top accent line */}
      <div className="h-[2px] bg-[var(--accent)]" />

      <div className="bg-[var(--darker)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Crosshair
              className="w-5 h-5 text-[var(--accent)] transition-transform duration-500 group-hover:rotate-90"
            />
            <span
              className="tracking-[0.3em] text-[var(--text)]"
              style={{ fontFamily: 'var(--font-orbitron, sans-serif)', fontSize: '0.85rem' }}
            >
              {siteConfig.name.split(' ')[0].toUpperCase()}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 tracking-[0.15em] transition-colors duration-300 ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                  style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.75rem' }}
                >
                  {link.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--accent)]" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side: status + profile toggle + mobile btn */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span
                className="text-green-400 tracking-widest"
                style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
              >
                ONLINE
              </span>
            </div>

            <ProfileModeToggle careerMode={careerMode} toggle={toggle} />

            <button
              className="md:hidden text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--darker)]/95 backdrop-blur-md border-b border-[var(--border)]">
          <div className="px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 tracking-[0.15em] border-l-2 transition-all ${
                    isActive
                      ? 'text-[var(--accent)] border-[var(--accent)] bg-[var(--accent)]/5'
                      : 'text-[var(--muted)] border-transparent hover:text-[var(--text)] hover:border-[var(--muted)]'
                  }`}
                  style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.8rem' }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { careerMode, toggle } = useProfileMode()

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar careerMode={careerMode} toggle={toggle} />

      {/* Push content below fixed navbar (16px top line + 64px nav = 66px) */}
      <main className="pt-[66px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[var(--accent)]" />
            <span
              className="tracking-[0.2em] text-[var(--muted)]"
              style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
            >
              {siteConfig.name.toUpperCase()} · {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {Object.entries(siteConfig.socials).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
              >
                {key === 'github' && <Github className="w-3.5 h-3.5" />}
                {key === 'linkedin' && <Linkedin className="w-3.5 h-3.5" />}
                <span className="tracking-widest uppercase">{key}</span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
