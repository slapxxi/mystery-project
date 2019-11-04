import firebase from 'firebase/app';
import 'firebase/firestore';
import { UID, User } from '../types';

async function fetchUser(uid: UID): Promise<User> {
  let db = firebase.firestore();
  try {
    let doc = await db
      .collection('users')
      .doc(uid)
      .get();
    let { handle, picture, name } = doc.data();

    return {
      uid: doc.id,
      name,
      handle,
      picture,
    };
  } catch (e) {
    throw e;
  }
}

export default fetchUser;
