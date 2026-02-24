import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bulletSchema } from '@/lib/validations/experience'
import { deserializeBullet } from '@/lib/serialize'
import { stringifyArray } from '@/lib/utils'
import { ZodError } from 'zod'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const rows = await prisma.bullet.findMany({
    where: { experienceId: params.id },
    orderBy: { order: 'asc' },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(rows.map((r: any) => deserializeBullet(r)))
}

export async function POST(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const data = bulletSchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.bullet.create as any)({
      data: { ...data, tags: stringifyArray(data.tags), experienceId: params.id },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeBullet(row as any), { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}
