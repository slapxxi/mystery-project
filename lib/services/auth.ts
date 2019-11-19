import { AuthUser } from '@self/lib/types';
import fetch from 'isomorphic-unfetch';

const HOST = process.env.HOST;

async function auth(user: firebase.User): Promise<AuthUser> {
  let token = await user.getIdToken();

  let response = await fetch(`${HOST ?? ''}/api/login`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  let body = await response.json();

  if (body.error) {
    throw new Error(body.error.message);
  }

  return body.decodedToken;
}

export default auth;
