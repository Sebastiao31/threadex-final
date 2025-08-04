// pages/api/auth/request-token.ts
import { twitterOAuth } from '@/lib/twitter';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

  const requestData = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    data: { oauth_callback: callbackUrl },
  };

  try {
    const headers = twitterOAuth.toHeader(
      twitterOAuth.authorize(requestData)
    );

    const response = await axios.post(requestData.url, null, {
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const params = new URLSearchParams(response.data);
    const oauthToken = params.get('oauth_token');

    res.redirect(`https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`);
  } catch (error: any) {
    console.error('OAuth Request Token Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get request token' });
  }
}
