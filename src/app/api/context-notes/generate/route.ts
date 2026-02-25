import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { parseJsonArray } from '@/lib/utils'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const requestSchema = z.object({
  entityType: z.enum(['experience', 'project', 'skill']),
  entityId: z.string().min(1),
})

async function buildPrompt(entityType: string, entityId: string): Promise<string> {
  if (entityType === 'experience') {
    const raw = await prisma.experience.findUnique({
      where: { id: entityId },
      include: { bullets: { orderBy: { order: 'asc' } } },
    })
    if (!raw) throw new Error('Experience not found')
    const bullets = raw.bullets.map(b => `- ${b.text}${b.metric ? ` (${b.metric})` : ''}`).join('\n')
    const tags = parseJsonArray(raw.tags).join(', ')

    return `You are generating rich private context notes for a resume builder. These notes are NEVER shown publicly — they are used as AI context to later generate better resume bullets, tailor applications, and answer recruiter questions.

Generate detailed, honest, first-person context notes for this work experience. Go beyond the resume bullets — capture the real story:
- Day-to-day responsibilities and how work actually happened
- Technical depth: tools, systems, architectures used
- Team size, your specific role, who you collaborated with
- Challenges faced and how you solved them
- Business or user impact of your work
- Anything notable that wouldn't fit in a bullet point
- Skills and technologies you used that aren't captured in bullets

Experience:
Role: ${raw.role}
Company: ${raw.company}
Dates: ${raw.startDate} → ${raw.endDate ?? 'Present'}
${raw.location ? `Location: ${raw.location}` : ''}
${raw.description ? `Summary: ${raw.description}` : ''}
${tags ? `Tags: ${tags}` : ''}

Resume Bullets:
${bullets || '(none yet)'}

Write 3–5 paragraphs of dense, honest context. Write in first person as if you are the person who held this role. Be specific — include actual technologies, team names, project names if known. This is a private brain dump, not a polished resume.`
  }

  if (entityType === 'project') {
    const raw = await prisma.project.findUnique({ where: { id: entityId } })
    if (!raw) throw new Error('Project not found')
    const techStack = parseJsonArray(raw.techStack).join(', ')

    return `You are generating rich private context notes for a resume builder. These notes are NEVER shown publicly.

Generate detailed context notes for this project. Capture:
- What problem it solves and who the users are
- How you built it — architecture decisions, tradeoffs
- Technical depth: specific libraries, APIs, patterns used
- Challenges encountered and solutions
- What you're proud of or would do differently
- Business/personal impact

Project:
Title: ${raw.title}
Pitch: ${raw.pitch}
${raw.casestudy ? `Case study: ${raw.casestudy}` : ''}
Tech stack: ${techStack}

Write 2–4 paragraphs in first person. Be specific and technical. This is private context, not marketing copy.`
  }

  if (entityType === 'skill') {
    const raw = await prisma.skill.findUnique({ where: { id: entityId } })
    if (!raw) throw new Error('Skill not found')

    return `You are generating rich private context notes for a resume builder. These notes are NEVER shown publicly.

Generate detailed context notes about this skill. Capture:
- How and when you learned it
- Projects or roles where you've used it
- Depth of knowledge: what you know well, where gaps might be
- How you'd describe your proficiency honestly to a technical interviewer

Skill: ${raw.name}
Group: ${raw.group}
Proficiency (1-5): ${raw.proficiency}

Write 1–2 paragraphs in first person. Be honest and specific.`
  }

  throw new Error(`Unsupported entityType: ${entityType}`)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { entityType, entityId } = requestSchema.parse(body)

  let prompt: string
  try {
    prompt = await buildPrompt(entityType, entityId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 404 })
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const note = await (prisma.contextNote as any).create({
    data: {
      entityType,
      entityId,
      content,
      aiGenerated: true,
      source: 'on-demand',
    },
  })

  return NextResponse.json(note, { status: 201 })
}
