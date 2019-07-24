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
    get: (params: any) => void;
    send: (params: any) => void;
    getKey?: (params: any) => void;
  }

  export default function(config: Configuration): Express.RequestHandler;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(): R;
    }
  }
}
