// pages/api/auth/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { twitterOAuth } from '@/lib/twitter'
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'
import axios from 'axios'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { oauth_token, oauth_verifier, uid } = req.query
  if (!oauth_token || !oauth_verifier) {
    return res.status(400).json({ error: 'Missing oauth_token or verifier' })
  }

  try {
    const accessRes = await axios.post('https://api.twitter.com/oauth/access_token', null, {
      headers: twitterOAuth.toHeader(
        twitterOAuth.authorize({ url: 'https://api.twitter.com/oauth/access_token', method: 'POST', data: { oauth_token, oauth_verifier } })
      ),
      params: { oauth_token, oauth_verifier },
    })

    const tokenData = Object.fromEntries(new URLSearchParams(accessRes.data)) as any
    const accessToken = tokenData.oauth_token
    const accessSecret = tokenData.oauth_token_secret
    const user_id = tokenData.user_id
    const screen_name = tokenData.screen_name

    const authForProfile = new OAuth({
      consumer: {
        key: process.env.TWITTER_API_KEY!,
        secret: process.env.TWITTER_API_SECRET!,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string: string, key: string) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64')
      },
    })

    const profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
    const profileRes = await axios.get(profileUrl, {
      headers: authForProfile.toHeader(
        authForProfile.authorize({ url: profileUrl, method: 'GET' }, { key: accessToken, secret: accessSecret })
      ),
    })

    const profile = profileRes.data

    const { error } = await supabaseAdmin.from('twitter_user').upsert(
      {
        twitter_id: user_id,
        screen_name,
        name: profile.name,
        profile_image_url: profile.profile_image_url_https,
        oauth_token: accessToken,
        oauth_token_secret: accessSecret,
        email: profile.email,
        user_id: typeof uid === 'string' ? uid : null,
      },
      { onConflict: 'twitter_id' }
    )

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'Failed to save Twitter user' })
    }

    return res.redirect('/dashboard')
  } catch (err: any) {
    console.error('Twitter OAuth error:', err.response?.data || err.message)
    return res.status(500).json({ error: 'Twitter auth flow failed' })
  }
}

