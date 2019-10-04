import firebase from 'firebase/app';
import 'firebase/firestore';
import uniq from 'lodash-es/uniq';
import { AuthUser, Post } from '../types';

async function uploadLike(post: Post, user: AuthUser) {
  let db = firebase.firestore();
  let postRef = db.collection('posts').doc(post.id);
  let postData = await postRef.get();
  let uniqueLikes = uniq([...(postData.data().likes || []), user.uid]);

  return postRef.update({ likes: uniqueLikes });
}

export default uploadLike;
