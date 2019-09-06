import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthUser, UID } from '../types';

async function fetchUser(uid: UID): Promise<AuthUser> {
  let db = firebase.firestore();
  try {
    let doc = await db
      .collection('users')
      .doc(uid)
      .get();
    let { handle, picture } = doc.data();

    return {
      uid: doc.id,
      handle,
      picture,
    };
  } catch (e) {
    throw e;
  }
}

export default fetchUser;
