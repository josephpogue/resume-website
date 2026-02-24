import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { leadershipSchema } from '@/lib/validations/leadership'
import { deserializeLeadership } from '@/lib/serialize'
import { stringifyArray } from '@/lib/utils'
import { ZodError } from 'zod'

type Params = { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const data = leadershipSchema.partial().parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.leadership.update as any)({
      where: { id: params.id },
      data: {
        ...data,
        ...(data.bullets && { bullets: stringifyArray(data.bullets) }),
        ...(data.tags && { tags: stringifyArray(data.tags) }),
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeLeadership(row as any))
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.leadership.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
