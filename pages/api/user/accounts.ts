// pages/api/user/accounts.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { uid } = req.query
    if (typeof uid !== 'string' || uid.length === 0) {
      return res.status(400).json({ error: 'Missing uid' })
    }

    const { data, error } = await supabaseAdmin
      .from('twitter_user')
      .select('twitter_id, screen_name, name, profile_image_url')
      .eq('user_id', uid)
      .order('screen_name', { ascending: true })

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch connected accounts', details: error.message })
    }

    const activeId = req.cookies.twitter_user_id || null
    const accounts = (data || []).map((a) => ({ ...a, isActive: activeId ? String(a.twitter_id) === String(activeId) : false }))
    return res.status(200).json({ accounts, activeId })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message || String(err) })
  }
}

