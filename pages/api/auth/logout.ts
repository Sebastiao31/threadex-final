// pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear authentication cookies
    res.setHeader('Set-Cookie', [
      'twitter_user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
      'twitter_screen_name=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
    ]);

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
}