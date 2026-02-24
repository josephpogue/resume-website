import { NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  const { password } = await req.json()

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await signToken()

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
