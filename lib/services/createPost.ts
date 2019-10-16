import { AuthUser, UserPost } from '@self/lib/types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from './firebaseConfig';

try {
  firebase.initializeApp(firebaseConfig);
} catch {}

async function createPost(user: AuthUser, post: UserPost) {
  let db = firebase.firestore();

  try {
    let assets = await uploadPostImages(user, post);
    let doc = await db.collection('posts').add({
      title: post.title,
      description: post.description,
      createdAt: new Date(),
      author: user.uid,
      likes: [],
      assets,
    });
    return doc.id;
  } catch (e) {
    throw e;
  }
}

async function uploadPostImages(user: AuthUser, post: UserPost) {
  let storage = firebase.storage();
  let userImagesRef = storage.ref(`user/${user.uid}/images/${post.title}`);
  let result = [];

  for (let i = 0; i < post.assets.length; i++) {
    let imageRef = userImagesRef.child(`${i}`);
    let upload = await imageRef.put(post.assets.item(i));
    let url = await upload.ref.getDownloadURL();
    result.push(url);
  }

  return result;
}

export default createPost;
