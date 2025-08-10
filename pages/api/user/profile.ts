// pages/api/user/profile.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { uid } = req.query
    const cookieTwitterId = req.cookies.twitter_user_id

    // Prefer active account selected via cookie; if uid also present, verify ownership
    if (cookieTwitterId) {
      const query = supabaseAdmin
        .from('twitter_user')
        .select('name, screen_name, profile_image_url, email, user_id, twitter_id')
        .eq('twitter_id', cookieTwitterId)
        .limit(1)
        .maybeSingle()

      const { data, error } = await query
      if (error) return res.status(500).json({ error: 'Failed to fetch profile by twitter_id', details: error.message })
      if (!data) return res.status(404).json({ error: 'No linked X account found for this cookie' })
      if (typeof uid === 'string' && uid.length > 0 && data.user_id && data.user_id !== uid) {
        return res.status(403).json({ error: 'Active account does not belong to this user' })
      }
      const { name, screen_name, profile_image_url, email } = data
      return res.status(200).json({ name, screen_name, profile_image_url, email })
    }

    // Fallback: by provided Supabase auth user id
    if (typeof uid === 'string' && uid.length > 0) {
      const { data, error } = await supabaseAdmin
        .from('twitter_user')
        .select('name, screen_name, profile_image_url, email')
        .eq('user_id', uid)
        .order('screen_name', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (error) return res.status(500).json({ error: 'Failed to fetch profile by user_id', details: error.message })
      if (!data) return res.status(404).json({ error: 'No linked X account found for this user' })
      return res.status(200).json(data)
    }

    return res.status(400).json({ error: 'Missing uid and no twitter_user_id cookie' })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message || String(err) })
  }
}

