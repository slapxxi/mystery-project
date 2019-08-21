import { AuthUser, UserPost } from '@self/lib/types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

try {
  firebase.initializeApp(firebaseConfig);
} catch {}

async function createPost(user: AuthUser, post: UserPost) {
  let db = firebase.firestore();

  try {
    await db.collection('posts').add({
      name: post.name,
      description: post.description,
      createdAt: new Date(),
    });
    return true;
  } catch (e) {
    throw e;
  }
}

export default createPost;
