import { Server } from '@self/lib/types';
import fetch from 'isomorphic-unfetch';

const HOST = process.env.HOST;

async function auth(user: firebase.User) {
  let token = await user.getIdToken();

  let response = await fetch(`${HOST}/api/login`, {
    method: 'post',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  let body: Server.AuthResponse = await response.json();

  return body.decodedToken;
}

export default auth;
