import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { skillSchema } from '@/lib/validations/skill'
import { deserializeSkill } from '@/lib/serialize'
import { stringifyArray } from '@/lib/utils'
import { ZodError } from 'zod'

export async function GET() {
  const rows = await prisma.skill.findMany({ orderBy: [{ group: 'asc' }, { order: 'asc' }] })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(rows.map((r: any) => deserializeSkill(r)))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = skillSchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.skill.create as any)({ data: { ...data, tags: stringifyArray(data.tags) } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeSkill(row as any), { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}
