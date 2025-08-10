// lib/twitter.ts
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'

export const twitterOAuth = new OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY!,
    secret: process.env.TWITTER_API_SECRET!,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString: string, key: string) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64')
  },
})

