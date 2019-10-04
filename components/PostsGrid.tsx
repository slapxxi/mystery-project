/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Link } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import routes from '@self/lib/routes';
import { Post } from '@self/lib/types';
import { format } from 'date-fns';
import Button from './Button';
import ButtonToggle from './ButtonToggle';
import CommentIcon from './icons/CommentIcon';
import EyeIcon from './icons/EyeIcon';
import HeartIcon from './icons/HeartIcon';
import * as styles from './PostsGrid.styles';

interface Props {
  posts: Post[];
  onLike?: (post: Post) => void;
  onUnlike?: (post: Post) => void;
}

function PostsGrid(props: Props) {
  let { posts, onLike, onUnlike } = props;
  let [authState] = useAuth();

  function handleLike(post: Post) {
    if (onLike) {
      onLike(post);
    }
  }

  function handleUnlike(post: Post) {
    if (onUnlike) {
      onUnlike(post);
    }
  }

  if (posts === null || posts.length === 0) {
    return <p>There are no posts available for current conditions.</p>;
  }

  return (
    <ul css={styles.container}>
      {posts.map((p) => (
        <li key={p.id} css={styles.item}>
          <header css={styles.header}>
            <div>
              <h3 css={styles.title}>
                <Link href={routes.post(p.id).url} as={routes.post(p.id).as}>
                  <a>{p.title}</a>
                </Link>
              </h3>
              {p.createdAt ? (
                <time css={styles.time}>
                  {format(new Date(p.createdAt), 'MMMM dd, y', {})}
                </time>
              ) : null}
            </div>
            {authState.matches('auth') && (
              <div>
                <Button>Save</Button>
                <LikeButton
                  post={p}
                  user={authState.context.user}
                  onLike={() => handleLike(p)}
                  onUnlike={() => handleUnlike(p)}
                ></LikeButton>
              </div>
            )}
          </header>
          <div css={styles.imageContainer}>
            <img src={p.assets[0]} alt="" css={styles.image} />
          </div>
          <footer css={styles.footer}>
            <span css={styles.iconContainer}>
              <EyeIcon css={styles.icon}></EyeIcon>0
            </span>
            <span css={styles.iconContainer}>
              <CommentIcon css={styles.icon}></CommentIcon>0
            </span>
            <span css={styles.iconContainer}>
              <HeartIcon css={styles.icon}></HeartIcon>
              {p.likes.length}
            </span>
          </footer>
        </li>
      ))}
    </ul>
  );
}

function LikeButton(props: any) {
  let { user, post, onLike, onUnlike } = props;
  let liked = post.likes && post.likes.includes(user.uid);

  return (
    <ButtonToggle
      onChange={(event) => (event.target.checked ? onLike(post) : onUnlike(post))}
      checked={liked}
    >
      <HeartIcon
        width={14}
        css={css`
          margin-right: 0.5rem;
          vertical-align: middle;
          fill: pink;
        `}
      ></HeartIcon>
      {liked ? 'Liked' : 'Like'}
    </ButtonToggle>
  );
}

export default PostsGrid;
