// pages/api/threads/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { THREAD_GENERATION_PROMPT } from '@/constants'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { topic, writingStyle, length, uid } = req.body || {}
    if (!topic || !writingStyle || !length || !uid) {
      return res.status(400).json({ error: 'Missing topic, writingStyle, length, or uid' })
    }

    const apiKey = process.env.NEXT_OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'NEXT_OPENAI_API_KEY is not set' })
    }

    // Prefer active cookie twitter_screen_name for CTA handle, fallback to placeholder
    const screenNameCookie = req.cookies.twitter_screen_name
    const userHandle = screenNameCookie ? `@${String(screenNameCookie).replace(/^@/, '')}` : '@yourhandle'

    const system = THREAD_GENERATION_PROMPT
    const user = `Topic: ${topic}\nWriting Style: ${writingStyle}\nNumber of Content Items/Tips: ${length}\nUser Handle: ${userHandle}\nRespond ONLY with a JSON array of tweets as specified.`

    const openaiPayload = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
    }

    const aiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(openaiPayload),
    })

    const aiJson = await aiResp.json()
    if (!aiResp.ok) {
      return res.status(aiResp.status).json({ error: 'OpenAI error', details: aiJson })
    }

    const content: string = aiJson?.choices?.[0]?.message?.content ?? ''
    if (!content) {
      return res.status(500).json({ error: 'Empty completion content' })
    }

    let tweets: string[] = []
    try {
      tweets = JSON.parse(content)
    } catch {
      const start = content.indexOf('[')
      const end = content.lastIndexOf(']')
      if (start !== -1 && end !== -1) {
        tweets = JSON.parse(content.slice(start, end + 1))
      } else {
        return res.status(500).json({ error: 'Model did not return a JSON array', content })
      }
    }

    const now = new Date().toISOString()

    // Insert thread into Supabase
    const { data, error } = await supabaseAdmin
      .from('threads')
      .insert({
        user_id: uid,
        name: topic,
        writing_style: writingStyle,
        status: 'Not Scheduled',
        last_edit: now,
        tweets,
      })
      .select('id')
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to save thread', details: error.message })
    }

    return res.status(200).json({ id: data.id })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message || String(err) })
  }
}

