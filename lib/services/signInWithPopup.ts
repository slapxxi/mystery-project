import firebase from 'firebase/app';
import 'firebase/auth';
import { AuthUser, Maybe } from '../types';
import auth from './auth';

async function signInWithPopup(): Promise<Maybe<AuthUser>> {
  try {
    let userCredentials = await firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider());
    let user = await auth(userCredentials.user!);
    return user;
  } catch (error) {
    throw error;
  }
}

export default signInWithPopup;
