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

export interface AppTheme {
  type: 'dark' | 'light';
  colors: {
    textLight: string;
    textEm: string;
  };
  sizes: {};
  fonts: {};
}

export interface PageContext extends NextContext {
  req?: ServerRequest;
}

export interface PageProps {
  t: (key: string) => string;
  user: Maybe<AuthUser>;
}

export interface AuthUser {
  uid: string;
  picture: string;
}

export interface AuthState {
  user: Maybe<AuthUser>;
  status: 'pending' | 'active' | 'anonymous' | 'signout';
}

export type AuthAction =
  | PayloadAction<'SIGN_IN', AuthUser>
  | PlainAction<'SIGN_OUT'>
  | PlainAction<'ERROR'>
  | PlainAction<'REQUEST_SIGN_IN'>
  | PlainAction<'REQUEST_SIGN_OUT'>;

export interface ServerRequest extends http.IncomingMessage {
  firebaseServer: admin.app.App;
  locale: 'en' | 'ru';
  session?: ServerSession;
}

export interface ServerSession {
  decodedToken?: Auth.User;
}

export namespace App {
  export interface Props {
    user: Maybe<Auth.User>;
    [key: string]: any;
  }

  export interface Context extends NextAppContext {
    ctx: Page.Context;
  }
}

export namespace Server {
  export interface Session {
    decodedToken?: Auth.User;
    error?: Error;
  }

  export interface Response extends http.ServerResponse {}

  export type AuthResponse =
    | { status: boolean; decodedToken: AuthUser }
    | { error: Error };

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

  export interface Context {
    state: State;
    dispatch: (action: AuthAction) => void;
  }

  export interface State {
    user: Maybe<User>;
  }

  export type Action = PayloadAction<'SIGN_IN', User> | PlainAction<'SIGN_OUT'>;
}
