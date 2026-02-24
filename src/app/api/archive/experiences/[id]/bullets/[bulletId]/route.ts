import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bulletSchema } from '@/lib/validations/experience'
import { deserializeBullet } from '@/lib/serialize'
import { stringifyArray } from '@/lib/utils'
import { ZodError } from 'zod'

type Params = { params: { id: string; bulletId: string } }

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const data = bulletSchema.partial().parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.bullet.update as any)({
      where: { id: params.bulletId },
      data: { ...data, ...(data.tags && { tags: stringifyArray(data.tags) }) },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeBullet(row as any))
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.bullet.delete({ where: { id: params.bulletId } })
  return NextResponse.json({ ok: true })
}
