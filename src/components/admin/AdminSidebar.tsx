'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Database,
  Layers,
  FileDown,
  LogOut,
  Globe,
  CloudDownload,
} from 'lucide-react'

const navItems = [
  { href: '/admin/archive',  label: 'Archive',  icon: Database,       sub: 'Career data' },
  { href: '/admin/loadouts', label: 'Loadouts', icon: Layers,         sub: 'Resume builds' },
  { href: '/admin/export',   label: 'Export',   icon: FileDown,       sub: 'PDF + preview' },
  { href: '/admin/import',   label: 'Import',   icon: CloudDownload,  sub: 'From Drive + AI' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen sticky top-0 bg-[var(--surface)] border-r border-[var(--border)]">
      {/* Logo */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[var(--accent)] rotate-45 animate-pulse" />
          <span className="text-sm font-bold tracking-widest text-[var(--text)] uppercase font-mono">
            Archive
          </span>
        </div>
        <p className="text-xs text-[var(--muted)] mt-1 font-mono">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, sub }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-150',
                active
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-l-2 border-[var(--accent)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/30',
              )}
            >
              <Icon size={16} className="shrink-0" />
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-[10px] opacity-60">{sub}</div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[var(--border)] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          <Globe size={14} />
          View public site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[var(--muted)] hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  )
}
