import { DocumentData } from '@google-cloud/firestore';
import { Comment, ID, Post } from '../types';
import fetchUser from './fetchUser';

async function parsePostData(id: ID, data: DocumentData): Promise<Post> {
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

  let parsedComments: Comment[] = await Promise.all(
    comments.map(async (c: any) => {
      let author = await fetchUser(c.author);
      return {
        ...c,
        likes: c.likes || [],
        postID: id,
        author,
      };
    })
  );

  return {
    id,
    assets,
    author,
    comments: parsedComments,
    description,
    likes,
    title,
    createdAt: new Date(createdAt.seconds),
    updatedAt: updatedAt && new Date(updatedAt.seconds),
  };
}

export default parsePostData;
