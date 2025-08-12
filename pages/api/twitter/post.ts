// pages/api/twitter/post.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'
import axios from 'axios'

const consumerKey = process.env.TWITTER_API_KEY!
const consumerSecret = process.env.TWITTER_API_SECRET!

const oauth = new OAuth({
  consumer: { key: consumerKey, secret: consumerSecret },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString: string, key: string) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64')
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { status, twitter_id: overrideTwitterId } = req.body || {}
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ error: 'Missing status in body' })
    }

    const twitterUserId = req.cookies.twitter_user_id
    const uid = typeof req.query.uid === 'string' ? req.query.uid : undefined

    if (!twitterUserId && !uid) {
      return res.status(401).json({ error: 'Not linked. No twitter_user_id cookie or uid provided.' })
    }

    // Fetch tokens from twitter_user with priority:
    // 1) explicit twitter_id override (if provided) with ownership check via uid
    // 2) active cookie twitter_user_id
    // 3) user_id (uid)
    const baseQuery = supabaseAdmin
      .from('twitter_user')
      .select('oauth_token, oauth_token_secret, screen_name, twitter_id, user_id')
      .limit(1)

    const tried: Array<{ by: string; value: string | undefined; ok: boolean; error?: string }> = []
    let data: any = null
    let error: any = null

    // 1) Explicit override
    if (overrideTwitterId) {
      const resOverride = await baseQuery.eq('twitter_id', overrideTwitterId).maybeSingle()
      tried.push({ by: 'twitter_id (override)', value: overrideTwitterId, ok: !resOverride.error && !!resOverride.data, error: resOverride.error?.message })
      if (!resOverride.error && resOverride.data) {
        if (uid && resOverride.data.user_id && resOverride.data.user_id !== uid) {
          return res.status(403).json({ error: 'Account does not belong to this user', twitter_id: overrideTwitterId })
        }
        data = resOverride.data
      }
    }

    // 2) Active cookie
    if (!data && twitterUserId) {
      const resCookie = await baseQuery.eq('twitter_id', twitterUserId).maybeSingle()
      tried.push({ by: 'twitter_id (cookie)', value: twitterUserId, ok: !resCookie.error && !!resCookie.data, error: resCookie.error?.message })
      if (!resCookie.error && resCookie.data) {
        data = resCookie.data
      }
    }
    // 3) Fallback by uid
    if (!data && uid) {
      const resUid = await baseQuery.eq('user_id', uid).maybeSingle()
      tried.push({ by: 'user_id (uid)', value: uid, ok: !resUid.error && !!resUid.data, error: resUid.error?.message })
      if (!resUid.error && resUid.data) {
        data = resUid.data
      }
    }

    if (!data) {
      return res.status(404).json({
        error: 'Could not load twitter credentials',
        details: 'No row found',
        triedFilters: tried,
      })
    }

    const token = { key: data.oauth_token as string, secret: data.oauth_token_secret as string }
    if (!token.key || !token.secret) {
      return res.status(400).json({ error: 'Missing stored oauth token/secret', row: data })
    }

    // Prefer v2 create Tweet endpoint
    try {
      const urlV2 = 'https://api.twitter.com/2/tweets'
      const headersV2 = oauth.toHeader(oauth.authorize({ url: urlV2, method: 'POST' }, token))
      const respV2 = await axios.post(urlV2, { text: status }, {
        headers: { ...headersV2, 'Content-Type': 'application/json' },
      })
      return res.status(200).json({ ok: true, tweet: respV2.data, screen_name: data.screen_name, api: 'v2' })
    } catch (v2err: any) {
      // Fallback to legacy v1.1 if available on the account (often not allowed on Basic plan)
      const statusCode: number | undefined = v2err?.response?.status
      const errBody = v2err?.response?.data
      const errMsg = typeof errBody === 'string' ? errBody : errBody ? JSON.stringify(errBody) : v2err?.message
      console.warn('V2 /2/tweets failed, attempting v1.1 fallback...', { statusCode, errMsg })

      const urlV11 = 'https://api.twitter.com/1.1/statuses/update.json'
      const headersV11 = oauth.toHeader(oauth.authorize({ url: urlV11, method: 'POST', data: { status } }, token))
      const respV11 = await axios.post(urlV11, new URLSearchParams({ status }), {
        headers: { ...headersV11, 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      return res.status(200).json({ ok: true, tweet: respV11.data, screen_name: data.screen_name, api: 'v1.1' })
    }
  } catch (err: any) {
    const statusCode: number | undefined = err?.response?.status
    const data = err?.response?.data
    const message = err?.message || String(err)
    const details = typeof data === 'string' ? data : data ? JSON.stringify(data) : message
    console.error('Twitter post error:', { statusCode, details })
    return res.status(statusCode || 500).json({ error: 'Failed to post tweet', details, statusCode })
  }
}

