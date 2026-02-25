import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  content: z.string().min(1),
})

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json()
  const { content } = updateSchema.parse(body)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const note = await (prisma.contextNote as any).update({
    where: { id: params.id },
    data: { content },
  })
  return NextResponse.json(note)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma.contextNote as any).delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
}
