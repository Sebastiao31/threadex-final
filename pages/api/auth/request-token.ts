// pages/api/auth/request-token.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { twitterOAuth } from '@/lib/twitter'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const uid = typeof req.query.uid === 'string' ? req.query.uid : undefined
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback${uid ? `?uid=${encodeURIComponent(uid)}` : ''}`
    const requestData = {
      url: 'https://api.twitter.com/oauth/request_token',
      method: 'POST',
      data: { oauth_callback: callbackUrl },
    }
    const headers = twitterOAuth.toHeader(twitterOAuth.authorize(requestData))
    const response = await axios.post(requestData.url, null, { headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' } })
    const params = new URLSearchParams(response.data as string)
    const oauthToken = params.get('oauth_token')
    if (!oauthToken) return res.status(500).json({ error: 'No oauth_token returned' })
    const authUrl = new URL(`https://api.twitter.com/oauth/authorize`)
    authUrl.searchParams.set('oauth_token', oauthToken)
    return res.redirect(authUrl.toString())
  } catch (error: any) {
    console.error('OAuth Request Token Error:', error.response?.data || error.message)
    return res.status(500).json({ error: 'Failed to get request token' })
  }
}

