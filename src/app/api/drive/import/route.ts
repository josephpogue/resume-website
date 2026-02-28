import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { EXTRACTION_PROMPT } from '@/lib/import-prompt'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get('google_access_token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'NOT_CONNECTED' }, { status: 401 })
  }

  const { fileId, mimeType } = await req.json()

  let messageContent: Anthropic.MessageParam['content']

  if (mimeType === 'application/vnd.google-apps.document') {
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!driveRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch file from Drive' }, { status: 500 })
    }
    const text = await driveRes.text()
    messageContent = `${EXTRACTION_PROMPT}\n\n---\n\n${text}`
  } else {
    // PDF — download and send as base64 document
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!driveRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch file from Drive' }, { status: 500 })
    }
    const buffer = await driveRes.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    messageContent = [
      {
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64 },
      } as Anthropic.DocumentBlockParam,
      { type: 'text', text: EXTRACTION_PROMPT },
    ]
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 16384,
    messages: [{ role: 'user', content: messageContent }],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : ''

  // Strip markdown code fences if the model wrapped the output
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
