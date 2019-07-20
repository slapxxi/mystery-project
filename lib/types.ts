import admin from 'firebase-admin';
import http from 'http';
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next';
import { WithTranslation } from 'next-i18next';
import { AppContext as NextAppContext } from 'next/app';

export type Language = 'en' | 'ru';

export type Maybe<T> = T | null;

export type PlainAction<T> = { type: T };

export interface PayloadAction<Type, Payload> {
  type: Type;
  payload: Payload;
}

export interface ExtendedEvent extends Event {
  waitUntil: <T>(promise: Promise<T>) => Promise<T>;
}

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
    bg: string;
  };
  sizes: {};
  fonts: {};
}

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

export interface PageContext extends NextPageContext {
  res?: ServerResponse;
  req?: ServerRequest;
}

/**
 * Props passed to page components
 */
export interface PageProps extends WithTranslation {
  /** Active user if there is one */
  user?: Maybe<AuthUser>;
}

export interface ServerRequest extends Express.Request, http.IncomingMessage {
  firebaseServer: admin.app.App;
  locale: Language;
  language: Language;
  session?: ServerSession;
}

/**
 * Next.js API request with additional properties defined by the custom server.
 */
export interface ApiRequest extends NextApiRequest {
  firebaseServer: admin.app.App;
  locale: Language;
  language: Language;
  session?: ServerSession;
}

/**
 * Next.js API response with additional properties defined by the custom server.
 */
export interface ApiResponse extends NextApiResponse {}

export interface ServerResponse extends Express.Response, http.ServerResponse {}

export type ServerAuthResponse =
  | { status: boolean; decodedToken: AuthUser }
  | { error: Error };

/**
 * Server session.
 */
export interface ServerSession extends Express.Session {
  decodedToken?: AuthUser;
  error?: Error;
}

/**
 * Extracts type from an array, function or promise container.
 */
export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;
