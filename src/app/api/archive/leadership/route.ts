import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { leadershipSchema } from '@/lib/validations/leadership'
import { deserializeLeadership } from '@/lib/serialize'
import { stringifyArray } from '@/lib/utils'
import { ZodError } from 'zod'

export async function GET() {
  const rows = await prisma.leadership.findMany({ orderBy: { order: 'asc' } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(rows.map((r: any) => deserializeLeadership(r)))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = leadershipSchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.leadership.create as any)({
      data: { ...data, bullets: stringifyArray(data.bullets), tags: stringifyArray(data.tags) },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeLeadership(row as any), { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}
