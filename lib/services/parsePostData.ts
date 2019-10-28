import { DocumentData } from '@google-cloud/firestore';
import { Comment, ID, Post } from '../types';

function parsePostData(id: ID, data: DocumentData): Post {
  let {
    assets,
    author,
    comments = [],
    description,
    likes,
    title,
    createdAt,
    updatedAt,
  } = data;

  return {
    id,
    assets,
    author,
    comments: comments.map((c: Comment) => ({ ...c, likes: c.likes || [], postID: id })),
    description,
    likes,
    title,
    createdAt: new Date(createdAt.seconds),
    updatedAt: updatedAt && new Date(updatedAt.seconds),
  };
}

export default parsePostData;
