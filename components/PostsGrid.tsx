/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Link } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import routes from '@self/lib/routes';
import uploadLike from '@self/lib/services/uploadLike';
import uploadUnlike from '@self/lib/services/uploadUnlike';
import { AppTheme, AuthUser, Post } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { assign, Machine } from 'xstate';
import Button from './Button';
import ButtonToggle from './ButtonToggle';
import CommentIcon from './icons/CommentIcon';
import EyeIcon from './icons/EyeIcon';
import HeartIcon from './icons/HeartIcon';
import * as styles from './PostsGrid.styles';
import ReadableDate from './ReadableDate';
import Spinner from './Spinner';

interface Props {
  posts: Post[];
}

function PostsGrid(props: Props) {
  let { posts } = props;

  if (posts === null || posts.length === 0) {
    return <p>There are no posts available for current conditions.</p>;
  }

  return (
    <ul css={styles.container}>
      {posts.map((post) => (
        <PostCard post={post} key={post.id}></PostCard>
      ))}
    </ul>
  );
}

interface CardProps {
  post: Post;
}

let cardMachine = Machine({
  id: 'card',
  initial: 'init',
  context: {
    post: null,
    user: null,
  },
  states: {
    init: {
      on: { '': [{ target: 'idle.liked', cond: 'isLiked' }, { target: 'idle.unliked' }] },
    },
    idle: {
      states: {
        liked: { on: { UNLIKE: { target: 'updating' } } },
        unliked: { on: { LIKE: { target: 'updating' } } },
        updating: {
          invoke: {
            id: 'update-post',
            src: 'update',
            onDone: { target: '#card.init', actions: 'setPost' },
            onError: 'error',
          },
        },
        error: {},
      },
    },
  },
});

interface CardContext {
  post: Post;
  user: AuthUser;
}

function PostCard(props: CardProps) {
  let { post } = props;
  let [authState] = useAuth();
  let [state, send] = useMachine(cardMachine, {
    context: { post, user: authState.context.user },
    guards: {
      isLiked: (context) => {
        if (context.user) {
          return context.post.likes.includes(context.user.uid);
        }
        return false;
      },
    },
    actions: { setPost: assign<CardContext>({ post: (context, event) => event.data }) },
    services: {
      update: (context, event) => {
        if (event.type === 'LIKE') {
          return uploadLike(post, context.user);
        } else {
          return uploadUnlike(post, context.user);
        }
      },
    },
  });

  return (
    <li key={post.id} css={styles.item}>
      <header css={styles.header}>
        <div>
          <h3 css={styles.title}>
            <Link href={routes.post(post.id).url} as={routes.post(post.id).as}>
              <a>{post.title}</a>
            </Link>
          </h3>
          {post.createdAt ? (
            <ReadableDate date={post.createdAt} css={styles.time}></ReadableDate>
          ) : null}
        </div>
        {authState.matches('auth') && (
          <div
            css={css`
              display: flex;
            `}
          >
            <Button>Save</Button>
            <ButtonToggle
              onChange={(event) => (event.target.checked ? send('LIKE') : send('UNLIKE'))}
              checked={state.matches('idle.liked')}
              disabled={state.matches('idle.updating')}
            >
              {state.matches('idle.updating') ? (
                <Spinner
                  width={20}
                  css={css`
                    stroke: grey;
                    fill: white;
                    margin-right: 0.5em;
                  `}
                ></Spinner>
              ) : (
                <HeartIcon
                  width={14}
                  css={css`
                    margin-right: 0.5rem;
                    vertical-align: middle;
                    fill: pink;
                  `}
                ></HeartIcon>
              )}
              {state.matches('idle.liked')
                ? 'Liked'
                : state.matches('idle.updating')
                ? 'Updating'
                : 'Like'}
            </ButtonToggle>
          </div>
        )}
      </header>

      <div css={styles.imageContainer}>
        <img src={post.assets[0]} alt="" css={styles.image} />
      </div>

      <footer css={styles.footer}>
        <span css={styles.iconContainer}>
          <EyeIcon css={styles.icon}></EyeIcon>0
        </span>
        <span css={styles.iconContainer}>
          <CommentIcon css={styles.icon}></CommentIcon> {post.comments.length}
        </span>
        <span css={styles.iconContainer}>
          <HeartIcon
            css={(theme: AppTheme) =>
              css`
                ${styles.icon(theme)}
                ${state.matches('idle.liked') ? 'fill: pink;' : null}
              `
            }
          ></HeartIcon>
          {state.context.post.likes.length}
        </span>
      </footer>
    </li>
  );
}

export default PostsGrid;
