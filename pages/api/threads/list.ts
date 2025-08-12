import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const uid = typeof req.query.uid === 'string' ? req.query.uid : ''
    if (!uid) return res.status(400).json({ error: 'Missing uid' })

    const { data, error } = await supabaseAdmin
      .from('threads')
      .select('id, name, writing_style, status, last_edit')
      .eq('user_id', uid)
      .order('last_edit', { ascending: false })

    if (error) return res.status(500).json({ error: 'Failed to fetch threads', details: error.message })

    return res.status(200).json({ threads: data || [] })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message || String(err) })
  }
}

