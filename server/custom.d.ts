declare namespace Express {
  export interface Request {
    firebaseServer: firebaseAdmin.app.App;
    locale: 'en' | 'ru';
    language: 'en' | 'ru';
  }
}

declare module 'cacheable-response' {
  export interface Configuration {
    ttl: number;
    getKey?: (params: any) => void;
    get: (params: any) => void;
    send: (params: any) => void;
  }

  export default function(config: Configuration): Express.RequestHandler;
}
