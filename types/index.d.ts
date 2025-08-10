export interface UserData {
    twitter_id: string;
    name: string;
    screen_name: string;
    profile_image_url: string;
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