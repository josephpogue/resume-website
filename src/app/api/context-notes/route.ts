import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSchema = z.object({
  entityType: z.enum(['experience', 'project', 'skill']),
  entityId: z.string().min(1),
  content: z.string().min(1),
  aiGenerated: z.boolean().optional().default(false),
  source: z.enum(['import', 'on-demand', 'manual']).optional().default('manual'),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const entityType = searchParams.get('entityType')
  const entityId = searchParams.get('entityId')

  if (!entityType || !entityId) {
    return NextResponse.json({ error: 'entityType and entityId are required' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notes = await (prisma.contextNote as any).findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const data = createSchema.parse(body)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const note = await (prisma.contextNote as any).create({ data })
  return NextResponse.json(note, { status: 201 })
}
