import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get user ID from cookies
    const twitterUserId = req.cookies.twitter_user_id

    if (!twitterUserId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Fetch user data from Supabase
    const { data: userData, error } = await supabaseAdmin
      .from('users')
      .select('name, screen_name, profile_image_url, email')
      .eq('twitter_id', twitterUserId)
      .single()

    if (error) {
      console.error('Supabase fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch user data' })
    }

    if (!userData) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(userData)
  } catch (error) {
    console.error('Profile API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 