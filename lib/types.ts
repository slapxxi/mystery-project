import admin from 'firebase-admin';
import http from 'http';
import { NextContext } from 'next';
import { NextAppContext } from 'next/app';

// Generic
export type Maybe<T> = T | null;

export type PlainAction<T> = { type: T };

export interface PayloadAction<Type, Payload> {
  type: Type;
  payload: Payload;
}

// App
export interface AppProps {
  user: Maybe<AuthUser>;
  [key: string]: any;
}

export interface AppContext extends NextAppContext {
  ctx: PageContext;
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

// Auth
export interface AuthUser {
  uid: string;
  picture: string;
}

export interface AuthState {
  user: Maybe<AuthUser>;
  status: 'pending' | 'active' | 'anonymous' | 'signout';
}

export interface AuthProps {
  user: Maybe<AuthUser>;
}

export interface AuthContext {
  state: AuthState;
  dispatch: (action: AuthAction) => void;
}

export type AuthAction =
  | PayloadAction<'SIGN_IN', AuthUser>
  | PlainAction<'SIGN_OUT'>
  | PlainAction<'ERROR'>
  | PlainAction<'REQUEST_SIGN_IN'>
  | PlainAction<'REQUEST_SIGN_OUT'>;

// Page
export interface PageContext extends NextContext {
  req?: ServerRequest;
}

export interface PageProps {
  t: (key: string) => string;
  lng: 'ru' | 'en';
  user: Maybe<AuthUser>;
}

// Server
export interface ServerRequest extends Express.Request, http.IncomingMessage {
  firebaseServer: admin.app.App;
  locale: 'en' | 'ru';
  language: 'en' | 'ru';
  session?: ServerSession;
}

export interface ServerResponse extends Express.Response, http.ServerResponse {}

export type ServerAuthResponse =
  | { status: boolean; decodedToken: AuthUser }
  | { error: Error };

export interface ServerSession extends Express.Session {
  decodedToken?: AuthUser;
  error?: Error;
}
