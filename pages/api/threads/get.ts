import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = typeof req.query.id === 'string' ? req.query.id : ''
    if (!id) return res.status(400).json({ error: 'Missing id' })

    const { data, error } = await supabaseAdmin
      .from('threads')
      .select('id, name')
      .eq('id', id)
      .maybeSingle()

    if (error) return res.status(500).json({ error: 'Failed to fetch thread', details: error.message })
    if (!data) return res.status(404).json({ error: 'Not found' })

    return res.status(200).json({ id: data.id, name: data.name })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message || String(err) })
  }
}

