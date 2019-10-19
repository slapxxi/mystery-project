import { AuthUser, Post } from './types';

function isLiked(post: Post, user: AuthUser) {
  return post.likes.includes(user.uid);
}

export default isLiked;
