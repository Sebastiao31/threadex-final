// pages/api/auth/callback.ts
import { twitterOAuth } from '@/lib/twitter';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { oauth_token, oauth_verifier } = req.query;

  if (!oauth_token || !oauth_verifier) {
    return res.status(400).json({ error: 'Missing oauth_token or verifier' });
  }

  const accessTokenData = {
    url: 'https://api.twitter.com/oauth/access_token',
    method: 'POST',
    data: {
      oauth_token,
      oauth_verifier,
    },
  };

 

  try {
    // Step 1: Exchange for access token
    const accessRes = await axios.post(accessTokenData.url, null, {
      headers: twitterOAuth.toHeader(twitterOAuth.authorize(accessTokenData)),
    });

    const tokenData = Object.fromEntries(new URLSearchParams(accessRes.data));
    const {
      oauth_token: accessToken,
      oauth_token_secret: accessSecret,
      user_id,
      screen_name,
    } = tokenData;

    // Step 2: Fetch profile info
    const authForProfile = new OAuth({
      consumer: {
        key: process.env.TWITTER_API_KEY!,
        secret: process.env.TWITTER_API_SECRET!,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });

    const profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true';

    const profileRes = await axios.get(profileUrl, {
      headers: authForProfile.toHeader(
        authForProfile.authorize(
          { url: profileUrl, method: 'GET' },
          { key: accessToken, secret: accessSecret }
        )
      ),
    });

    const profile = profileRes.data;

    // Step 3: Save to Supabase
    const { error } = await supabaseAdmin.from('users').upsert({
      twitter_id: user_id,
      screen_name,
      name: profile.name,
      profile_image_url: profile.profile_image_url_https,
      oauth_token: accessToken,
      oauth_token_secret: accessSecret,
      email: profile.email,
    }, { onConflict: 'twitter_id' });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save Twitter user' });
    }

    // Set session cookie to track logged-in user
    res.setHeader('Set-Cookie', [
      `twitter_user_id=${user_id}; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`, // 7 days
      `twitter_screen_name=${screen_name}; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}` // 7 days
    ]);

    res.redirect(`/loading`);
  } catch (err: any) {
    console.error('Twitter OAuth error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Twitter auth flow failed' });
  }
}
