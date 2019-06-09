import firebase from 'firebase/app';
import 'firebase/auth';
import fetch from 'isomorphic-unfetch';
import firebaseConfig from './firebaseConfig';

const HOST = process.env.HOST;

let app: firebase.app.App;

try {
  app = firebase.initializeApp(firebaseConfig);
} catch (error) {
  app = firebase.app();
}

async function signOut() {
  try {
    await app.auth().signOut();
    let response = await fetch(`${HOST}/api/logout`, { method: 'POST' });
    let message = await response.json();
    return message;
  } catch (error) {
    console.log(error);
  }
}

export default signOut;
