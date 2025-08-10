// pages/api/user/switch-account.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { twitter_id } = req.body || {}
    const { uid } = req.query
    if (!twitter_id) {
      return res.status(400).json({ error: 'Missing twitter_id' })
    }
    if (typeof uid !== 'string' || uid.length === 0) {
      return res.status(400).json({ error: 'Missing uid' })
    }

    // Verify that this account belongs to this user
    const { data, error } = await supabaseAdmin
      .from('twitter_user')
      .select('twitter_id, screen_name')
      .eq('twitter_id', twitter_id)
      .eq('user_id', uid)
      .maybeSingle()

    if (error || !data) {
      return res.status(404).json({ error: 'Account not found for this user' })
    }

    const cookieOptions = 'Path=/; SameSite=Strict; Max-Age=' + (7 * 24 * 60 * 60)
    res.setHeader('Set-Cookie', [
      `twitter_user_id=${twitter_id}; ${cookieOptions}`,
      `twitter_screen_name=${data.screen_name}; ${cookieOptions}`,
    ])
    return res.status(200).json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message || String(err) })
  }
}

