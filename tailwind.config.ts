import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Valorant dark theme — updated to reference palette
        val: {
          dark:      '#0f1923',
          darker:    '#0a1017',
          navy:      '#1a2332',
          blue:      '#1f3044',
          red:       '#ff4655',
          'red-dim': '#cc2233',
          teal:      '#00ffff',
          cream:     '#ece8e1',
          gray:      '#7b8ea0',
        },
        // Recruiter / clean professional theme
        rec: {
          bg:      '#ffffff',
          surface: '#f8fafc',
          border:  '#e2e8f0',
          accent:  '#2563eb',
          text:    '#1e293b',
          muted:   '#64748b',
        },
      },
      fontFamily: {
        orbitron:   ['var(--font-orbitron)', 'sans-serif'],
        rajdhani:   ['var(--font-rajdhani)', 'sans-serif'],
        'mono-val': ['var(--font-mono-val)', 'monospace'],
        sans: ['var(--font-rajdhani)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono-val)', 'var(--font-mono)', 'monospace'],
      },
      animation: {
        'spin-slow':         'spin-slow 30s linear infinite',
        'spin-slow-reverse': 'spin-slow-reverse 20s linear infinite',
        'fade-up':           'fade-up 0.6s ease forwards',
        'glow-pulse':        'glowPulse 2s ease-in-out infinite alternate',
        'scan-line':         'scanLine 3s linear infinite',
        'corner-blink':      'cornerBlink 2s ease-in-out infinite',
      },
      keyframes: {
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-slow-reverse': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%':   { boxShadow: '0 0 4px #ff4655, 0 0 8px #ff465540' },
          '100%': { boxShadow: '0 0 12px #ff4655, 0 0 24px #ff465560' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        cornerBlink: {
          '0%, 100%': { opacity: '0.3' },
          '50%':      { opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-val': `
          linear-gradient(rgba(255,70,85,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,70,85,0.04) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid-val': '32px 32px',
      },
    },
  },
  plugins: [],
}

export default config
