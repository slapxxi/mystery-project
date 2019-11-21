import { DocumentData } from '@google-cloud/firestore';
import { Comment, DBComment, ID, Post } from '../types';
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
    comments.map(async (c: DBComment) => {
      let author = await fetchUser(c.author);
      let asyncReplies = (c.replies ?? []).map(async (r) => {
        let replyAuthor = await fetchUser(r.author);
        return {
          ...r,
          author: replyAuthor,
        };
      });
      let replies = await Promise.all(asyncReplies);

      return {
        ...c,
        likes: c.likes || [],
        postID: id,
        replies,
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
