import fetch from 'isomorphic-unfetch';

const HOST = process.env.HOST;

async function auth(user: firebase.User) {
  let token = await user.getIdToken();
  let content = null;

  let response = await fetch(`${HOST}/api/login`, {
    method: 'post',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  content = await response.json();

  return content;
}

export default auth;
