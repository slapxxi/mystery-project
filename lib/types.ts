import admin from 'firebase-admin';
import http from 'http';
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next';
import { AppContext as NextAppContext } from 'next/app';
import { WithTranslation } from 'react-i18next';

export type ID = string;

export type UID = string;

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
    text: string;
    textLight: string;
    textEm: string;
    bg: string;
    itemBg: string;
    headerBg: string;
    headerLink: string;
    headerLinkActive: string;
  };
  sizes: {};
  fonts: {};
}

export interface AuthUser {
  uid: string;
  picture: string;
  handle: string;
}

export interface AuthState {
  user: Maybe<AuthUser>;
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
 * Props passed to page components.
 */
export interface PageProps {
  /** Active user if there is one */
  user?: Maybe<AuthUser>;
}

/**
 * Props with additional translation arguments passed to page components.
 */
export interface PagePropsWithTranslation<Namespace extends TranslationNamespace>
  extends PageProps,
    Omit<WithTranslation, 't'> {
  t: (key: PickTranslation<Namespace>) => string;
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

export interface Route {
  url: string;
  as?: string;
}

export interface DynamicRoute<T> {
  (...params: T[]): Route;
}

export type PickTranslation<T> = T extends 'common'
  ? CommonTranslationKey
  : T extends 'header'
  ? HeaderTranslationKey
  : any;

export type TranslationNamespace = 'common' | 'header' | 'footer';

export type TranslationKey = CommonTranslationKey | HeaderTranslationKey;

export type CommonTranslationKey = keyof typeof import('@self/static/locales/en/common.json');

export type HeaderTranslationKey = keyof typeof import('@self/static/locales/en/header.json');

export interface UserPost {
  title: string;
  description: string;
  assets: FileList;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  author: UID;
  assets: string[];
  likes: UID[];
  createdAt: Date;
  updatedAt: Date;
}

export type NormalizedPost = Normalized<Post>;

type Normalized<T> = {
  [P in keyof T]: T[P] extends Date ? string : T[P];
};

export type PostCategory = 'following' | 'popular' | 'recent';

export interface Subscription extends Post {}
