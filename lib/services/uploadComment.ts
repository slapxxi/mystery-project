import firebase from 'firebase/app';
import 'firebase/firestore';
import uuid from 'uuid';
import { AuthUser, Comment, Post } from '../types';
import parsePostData from './parsePostData';

async function uploadComment(post: Post, user: AuthUser, comment: string): Promise<Post> {
  let db = firebase.firestore();
  let postRef = db.collection('posts').doc(post.id);
  let postSnapshot = await postRef.get();
  let comments = postSnapshot.data().comments || [];

  await postRef.update({
    comments: [
      ...comments,
      // @ts-ignore
      {
        author: user.uid,
        likes: [],
        id: uuid.v4(),
        postID: post.id,
        body: comment,
        replies: [],
        createdAt: new Date(),
      } as Comment,
    ],
  });

  return parsePostData(post.id, (await postRef.get()).data());
}

export default uploadComment;
