import firebase from 'firebase/app';
import 'firebase/firestore';
import { ID, Post } from '../types';
import parsePostData from './parsePostData';

async function fetchPost(postID: ID): Promise<Post> {
  let db = firebase.firestore();

  let post = await db
    .collection('posts')
    .doc(postID)
    .get();

  if (post.exists) {
    return parsePostData(postID, post.data());
  } else {
    throw new Error('Requested post does not exist');
  }
}

export default fetchPost;
