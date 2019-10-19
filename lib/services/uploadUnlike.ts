import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthUser, Post } from '../types';
import parsePostData from './parsePostData';

async function uploadUnlike(post: Post, user: AuthUser): Promise<Post> {
  let db = firebase.firestore();
  let postRef = db.collection('posts').doc(post.id);
  let postData = await postRef.get();
  let uniqueLikes = postData.data().likes.filter((id: string) => id !== user.uid);

  await postRef.update({ likes: uniqueLikes });

  return parsePostData(post.id, (await postRef.get()).data());
}

export default uploadUnlike;
