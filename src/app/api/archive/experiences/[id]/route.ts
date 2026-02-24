import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { experienceSchema } from '@/lib/validations/experience'
import { deserializeExperience } from '@/lib/serialize'
import { stringifyArray } from '@/lib/utils'
import { ZodError } from 'zod'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const row = await prisma.experience.findUnique({
    where: { id: params.id },
    include: { bullets: { orderBy: { order: 'asc' } } },
  })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(deserializeExperience(row as any))
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const data = experienceSchema.partial().parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.experience.update as any)({
      where: { id: params.id },
      data: { ...data, ...(data.tags && { tags: stringifyArray(data.tags) }) },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeExperience(row as any))
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.experience.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
