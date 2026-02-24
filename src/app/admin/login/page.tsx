'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin/archive')
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block mb-4">
            <span className="text-xs font-mono tracking-[0.3em] text-[var(--accent)] uppercase">
              Admin Access
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            <span className="neon-red">Archive</span> Login
          </h1>
          <p className="text-sm text-[var(--muted)] mt-2">Private access only</p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 clip-corner">
          <div className="h-0.5 w-16 bg-[var(--accent)] mb-6" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              autoComplete="current-password"
              error={error}
            />
            <Button type="submit" className="w-full" disabled={loading || !password}>
              {loading ? 'Authenticating...' : 'Enter Archive'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--muted)] mt-6 font-mono">
          AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </div>
  )
}
