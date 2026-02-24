import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { experienceSchema } from '@/lib/validations/experience'
import { deserializeExperience } from '@/lib/serialize'
import { stringifyArray } from '@/lib/utils'
import { ZodError } from 'zod'

export async function GET() {
  const rows = await prisma.experience.findMany({
    include: { bullets: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(rows.map((r: any) => deserializeExperience(r)))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = experienceSchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.experience.create as any)({
      data: { ...data, tags: stringifyArray(data.tags) },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeExperience(row as any), { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}
