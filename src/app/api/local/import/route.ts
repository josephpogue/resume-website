import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import mammoth from 'mammoth'
import { EXTRACTION_PROMPT } from '@/lib/import-prompt'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const name = file.name.toLowerCase()
  const isPdf = file.type === 'application/pdf' || name.endsWith('.pdf')
  const isDocx =
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')

  let messageContent: Anthropic.MessageParam['content']

  if (isPdf) {
    const base64 = buffer.toString('base64')
    messageContent = [
      {
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64 },
      } as Anthropic.DocumentBlockParam,
      { type: 'text', text: EXTRACTION_PROMPT },
    ]
  } else if (isDocx) {
    const result = await mammoth.extractRawText({ buffer })
    messageContent = `${EXTRACTION_PROMPT}\n\n---\n\n${result.value}`
  } else {
    // Plain text, markdown, CSV, etc.
    const text = buffer.toString('utf-8')
    messageContent = `${EXTRACTION_PROMPT}\n\n---\n\n${text}`
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 16384,
    messages: [{ role: 'user', content: messageContent }],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
  const cleaned = rawText.replace(/^```(?:json)?\n?|\n?```$/g, '').trim()

  try {
    return NextResponse.json(JSON.parse(cleaned))
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse AI response', raw: rawText },
      { status: 500 }
    )
  }
}
