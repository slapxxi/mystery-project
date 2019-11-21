import { Comment, DBComment } from '../types';
import fetchUser from './fetchUser';

async function parseComment(comment: DBComment): Promise<Comment> {
  let author = await fetchUser(comment.author);
  let asyncReplies = comment.replies.map(async (r) => {
    let replyAuthor = await fetchUser(r.author);
    return {
      ...r,
      author: replyAuthor,
    };
  });
  let replies = await Promise.all(asyncReplies);

  return { ...comment, author, replies };
}

export default parseComment;
