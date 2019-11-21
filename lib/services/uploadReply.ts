import firebase from 'firebase/app';
import 'firebase/firestore';
import uuid from 'uuid';
import { AuthUser, Comment, DBComment } from '../types';
import parseComment from './parseComment';

async function uploadReply(
  comment: Comment,
  user: AuthUser,
  reply: string
): Promise<Comment> {
  let db = firebase.firestore();
  let postRef = db.collection('posts').doc(comment.postID);
  let postSnapshot = await postRef.get();
  let comments: DBComment[] = postSnapshot.data().comments;
  let commentIndex = comments.findIndex((c) => c.id === comment.id);

  if (commentIndex === -1) {
    throw new Error('Comment does not exist');
  }

  let updatedComments: DBComment[] = comments.map((c) => {
    if (c.id === comment.id) {
      return {
        ...c,
        replies: [
          ...c.replies,
          {
            id: uuid.v4(),
            commentID: c.id,
            author: user.uid,
            body: reply,
            createdAt: new Date(),
            likes: [],
          },
        ],
      };
    }
    return c;
  });

  await postRef.update({ comments: updatedComments });

  return parseComment((await postRef.get()).data().comments[commentIndex]);
}

export default uploadReply;
