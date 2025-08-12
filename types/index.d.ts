export interface UserData {
    twitter_id: string;
    name: string;
    screen_name: string;
    profile_image_url: string;
}

export interface TweetData {
  text: string;
  image?: {
      url: string;
      prompt?: string;
      generatedAt?: string;
  };
}

export interface Thread {
  id: string;
  user_id: string;
  name: string;
  status: 'Not Scheduled' | 'Scheduled' | 'Posted';
  topic: string;
  writing_style: string;
  thread_length: number;
  tweets: (string | TweetData)[];
  created_at: string;
  updated_at: string;
}

export interface ThreadDisplay {
  id: string;
  name: string;
  status: 'Not Scheduled' | 'Scheduled' | 'Posted';
  lastEdit: string;
}

// Minimal module declaration to satisfy TS for oauth-1.0a
declare module 'oauth-1.0a' {
  export default class OAuth {
    constructor(config: {
      consumer: { key: string; secret: string }
      signature_method: string
      hash_function: (baseString: string, key: string) => string
    })
    authorize(
      request: { url: string; method: string; data?: Record<string, any> },
      token?: { key: string; secret: string }
    ): any
    toHeader(authData: any): Record<string, string>
  }
}