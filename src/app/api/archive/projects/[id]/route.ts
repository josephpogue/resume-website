import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations/project'
import { deserializeProject } from '@/lib/serialize'
import { stringifyArray } from '@/lib/utils'
import { ZodError } from 'zod'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const row = await prisma.project.findUnique({ where: { id: params.id } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(deserializeProject(row as any))
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const data = projectSchema.partial().parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.project.update as any)({
      where: { id: params.id },
      data: {
        ...data,
        ...(data.tags && { tags: stringifyArray(data.tags) }),
        ...(data.techStack && { techStack: stringifyArray(data.techStack) }),
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeProject(row as any))
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.project.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
