import firebase from 'firebase/app';
import 'firebase/firestore';
import uniq from 'lodash-es/uniq';
import { AuthUser, Comment } from '../types';

async function uploadCommentLike(comment: Comment, user: AuthUser): Promise<Comment> {
  let db = firebase.firestore();
  let postRef = db.collection('posts').doc(comment.postID);
  let postSnapshot = await postRef.get();
  let comments = postSnapshot.data().comments;

  let updatedComment;

  let updatedComments = comments.map((c: Comment) => {
    if (c.id === comment.id) {
      updatedComment = { ...c, likes: uniq([...(c.likes || []), user.uid]) };
      return updatedComment;
    }
    return c;
  });

  await postRef.update({ comments: updatedComments });

  return updatedComment;
}

export default uploadCommentLike;
