import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthUser, Comment } from '../types';
import fetchUser from './fetchUser';

async function uploadCommentUnlike(comment: Comment, user: AuthUser): Promise<Comment> {
  let db = firebase.firestore();
  let postRef = db.collection('posts').doc(comment.postID);
  let postSnapshot = await postRef.get();
  let comments = postSnapshot.data().comments;
  let updatedComments = comments.map((c: Comment) => {
    if (c.id === comment.id) {
      return { ...c, likes: c.likes.filter((uid) => uid !== user.uid) };
    }
    return c;
  });

  await postRef.update({ comments: updatedComments });

  let updatedComment = (await postRef.get())
    .data()
    .comments.find((c: Comment) => c.id === comment.id);

  return {
    ...updatedComment,
    author: await fetchUser((updatedComment.author as unknown) as string),
  };
}

export default uploadCommentUnlike;
