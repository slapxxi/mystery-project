import fetch from 'isomorphic-unfetch';

const HOST = process.env.HOST;

async function logout() {
  await fetch(`${HOST}/api/logout`, {});
}

export default logout;
