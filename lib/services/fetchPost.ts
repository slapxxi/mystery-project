import firebase from 'firebase/app';
import 'firebase/firestore';
import { ID } from '../types';

async function fetchPost(postID: ID) {
  let db = firebase.firestore();

  let post = await db
    .collection('posts')
    .doc(postID)
    .get();

  if (post.exists) {
    return post.data();
  } else {
    throw new Error('Requested post does not exist');
  }
}

export default fetchPost;
