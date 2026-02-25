import { Metadata } from 'next'
import { TacticalGrid } from '@/components/public/TacticalGrid'
import { SectionHeader } from '@/components/public/SectionHeader'

export const metadata: Metadata = { title: 'Loadout' }

// TODO: Replace with your actual gamer tags
const gamerTags = [
  { platform: 'VALORANT', tag: '[ YOUR TAG #0000 ]', rank: '[ YOUR RANK ]' },
  { platform: 'STEAM', tag: '[ YOUR STEAM NAME ]', rank: null },
  { platform: 'DISCORD', tag: '[ YOUR DISCORD ]', rank: null },
]

// TODO: Replace with your actual peripherals and PC specs
const peripherals = [
  {
    category: 'INPUT',
    items: [
      { name: 'Mouse', value: '[ YOUR MOUSE ]', spec: '[ DPI / POLLING RATE ]' },
      { name: 'Keyboard', value: '[ YOUR KEYBOARD ]', spec: '[ SWITCH TYPE ]' },
      { name: 'Mousepad', value: '[ YOUR PAD ]', spec: '[ SIZE ]' },
    ],
  },
  {
    category: 'DISPLAY',
    items: [
      { name: 'Monitor', value: '[ YOUR MONITOR ]', spec: '[ RESOLUTION / HZ ]' },
    ],
  },
  {
    category: 'AUDIO',
    items: [
      { name: 'Headset', value: '[ YOUR HEADSET ]', spec: '[ DRIVER SIZE ]' },
    ],
  },
  {
    category: 'SYSTEM',
    items: [
      { name: 'CPU', value: '[ YOUR CPU ]', spec: '[ CORES / GHz ]' },
      { name: 'GPU', value: '[ YOUR GPU ]', spec: '[ VRAM ]' },
      { name: 'RAM', value: '[ YOUR RAM ]', spec: '[ SPEED ]' },
    ],
  },
]

export default function LoadoutPage() {
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
              // AGENT LOADOUT
            </span>
          </div>
          <h1 className="text-[var(--text)] mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
            Setup &amp; <span className="text-[var(--accent)]">Loadout</span>
          </h1>
          <p className="text-[var(--muted)]" style={{ fontSize: '0.95rem' }}>
            Peripherals, rig specs, and gamer tags
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* Gamer Tags */}
        <section>
          <SectionHeader
            label="// IDENTITY"
            title="Gamer Tags"
            subtitle="Find me on these platforms"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamerTags.map(({ platform, tag, rank }) => (
              <div
                key={platform}
                className="group p-5 border border-[var(--border)] bg-[var(--navy)]/20 hover:border-[var(--accent)]/40 transition-all duration-500"
                style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
              >
                <div
                  className="text-[var(--accent)] tracking-[0.2em] mb-2"
                  style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
                >
                  {platform}
                </div>
                <div
                  className="text-[var(--text)] font-semibold mb-1"
                  style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '1.05rem' }}
                >
                  {tag}
                </div>
                {rank && (
                  <div
                    className="text-[var(--muted)]"
                    style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
                  >
                    {rank}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Peripherals */}
        <section>
          <SectionHeader
            label="// HARDWARE"
            title="Peripheral Setup"
            subtitle="The gear behind the gameplay"
          />
          <div className="space-y-8">
            {peripherals.map(({ category, items }) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-4 h-[2px] bg-[var(--accent)]/60" />
                  <span
                    className="text-[var(--muted)] tracking-[0.25em]"
                    style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
                  >
                    {category}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(({ name, value, spec }) => (
                    <div
                      key={name}
                      className="flex items-start gap-4 p-4 border border-[var(--border)] bg-[var(--surface)]/10 hover:border-[var(--accent)]/30 transition-all"
                    >
                      <div className="flex-1">
                        <div
                          className="text-[var(--muted)] mb-1"
                          style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.65rem' }}
                        >
                          {name.toUpperCase()}
                        </div>
                        <div
                          className="text-[var(--text)] font-semibold"
                          style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '0.95rem' }}
                        >
                          {value}
                        </div>
                        <div
                          className="text-[var(--muted)]/60 mt-0.5"
                          style={{ fontFamily: 'var(--font-mono-val, monospace)', fontSize: '0.6rem' }}
                        >
                          {spec}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
