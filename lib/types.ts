import admin from 'firebase-admin';
import http from 'http';
import { NextContext } from 'next';
import { NextAppContext } from 'next/app';

export type Maybe<T> = T | null;

export type PlainAction<T> = { type: T };

export interface PayloadAction<Type, Payload> {
  type: Type;
  payload: Payload;
}

export namespace App {
  export interface Props {
    user: Maybe<Auth.User>;
    [key: string]: any;
  }

  export interface Theme {
    type: 'dark' | 'light';
    colors: {
      textLight: string;
      textEm: string;
    };
    sizes: {};
    fonts: {};
  }

  export interface Context extends NextAppContext {
    ctx: Page.Context;
  }
}

export namespace Server {
  export interface Session {
    decodedToken?: Auth.User;
  }

  export interface Response extends http.ServerResponse {}

  export interface AuthResponse {
    status: boolean;
    decodedToken: Auth.User;
  }

  export interface Request extends http.IncomingMessage {
    firebaseServer: admin.app.App;
    locale: 'en' | 'ru';
    session?: Session;
  }
}

export namespace Page {
  export interface Props {
    t: (key: string) => string;
    user: Maybe<Auth.User>;
  }

  export interface Context extends NextContext {
    req?: Server.Request;
  }
}

export namespace Auth {
  export interface User {
    uid: string;
    picture: string;
  }

  export interface Props {
    user: Maybe<User>;
  }

  export interface State {
    user: Maybe<User>;
  }

  export type Action = PayloadAction<'SIGN_IN', User> | PlainAction<'SIGN_OUT'>;
}
