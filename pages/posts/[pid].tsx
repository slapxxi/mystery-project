/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Avatar from '@self/components/Avatar';
import Button from '@self/components/Button';
import ButtonToggle from '@self/components/ButtonToggle';
import Carousel from '@self/components/Carousel';
import HeartIcon from '@self/components/icons/HeartIcon';
import LikeButton from '@self/components/LikeButton';
import ReadableDate from '@self/components/ReadableDate';
import Spinner from '@self/components/Spinner';
import { Link, withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import routes from '@self/lib/routes';
import fetchPost from '@self/lib/services/fetchPost';
import fetchUser from '@self/lib/services/fetchUser';
import uploadCommentLike from '@self/lib/services/uploadCommentLike';
import uploadCommentUnlike from '@self/lib/services/uploadCommentUnlike';
import {
  AppTheme,
  AuthUser,
  Comment,
  PageContext,
  PagePropsWithTranslation,
  Post,
} from '@self/lib/types';
import { useMachine } from '@xstate/react';
import ErrorPage from 'next/error';
import { assign, Machine } from 'xstate';

interface Props extends PagePropsWithTranslation<'common'> {
  post: Post;
}

interface Context {
  post: Post;
  user: AuthUser;
  author: AuthUser;
}

let pageMachine = Machine<Context>({
  id: 'post-machine',
  initial: 'idle',
  context: {
    user: null,
    post: null,
    author: null,
  },
  states: {
    idle: {
      on: {
        '': [
          { target: 'error.notFound', cond: (context) => !context.post },
          { target: 'viewing.auth', cond: 'isAuth' },
          { target: 'viewing.loading' },
        ],
      },
    },
    viewing: {
      states: {
        loading: {
          invoke: {
            src: 'fetchAuthor',
            onDone: {
              target: 'user',
              // @ts-ignore
              actions: assign({ author: (context, event) => event.data }),
            },
          },
        },
        user: {},
        auth: { on: { EDIT: '#editing' } },
        hist: { type: 'history' },
      },
    },
    editing: { id: 'editing', on: { CANCEL: 'viewing.hist' } },
    error: {
      states: {
        notFound: {},
      },
    },
  },
});

// todo: move user extraction to `getInitialProps` or to the post fetching service
// todo: eliminate layout shifting while content is loading
function PostPage(props: Props) {
  let { post, t } = props;
  let [authState] = useAuth();
  let [state, send] = useMachine<Context, any>(pageMachine, {
    context: { post, user: authState.context.user },
    guards: {
      isAuth: (context) =>
        context.user && context.post && context.user.uid === context.post.author,
    },
    services: { fetchAuthor: (context) => fetchUser(context.post.author) },
  });

  if (state.matches('error.notFound')) {
    return <ErrorPage statusCode={404}></ErrorPage>;
  }

  return (
    <div>
      <header
        css={css`
          display: flex;
          padding: 0.5rem;

          @media screen and (min-width: 640px) {
            padding: 1rem;
          }
        `}
      >
        {state.matches('viewing.user') && (
          <Avatar size="40px" user={state.context.author} css={avatarStyles}></Avatar>
        )}
        {state.matches('viewing.auth') && (
          <Avatar size="40px" user={state.context.user} css={avatarStyles}></Avatar>
        )}
        <div
          css={css`
            display: flex;
            flex-direction: column;
            flex: 1;

            @media screen and (min-width: 640px) {
              flex-direction: row;
              align-items: center;
            }
          `}
        >
          <div
            css={css`
              margin-bottom: 1rem;

              @media screen and (min-width: 640px) {
                margin: 0;
                flex: 1;
              }
            `}
          >
            <h1 css={titleStyles}>{post.title}</h1>
            <h2 css={subtitleStyles}>
              by{' '}
              {state.matches('viewing.auth') && (
                <Link
                  href={routes.user(state.context.user.uid).url}
                  as={routes.user(state.context.user.uid).as}
                >
                  <a
                    css={css`
                      background: linear-gradient(
                        90deg,
                        hsl(200, 70%, 50%) 0%,
                        hsl(350, 90%, 60%) 100%
                      );
                      -webkit-background-clip: text;
                      background-clip: text;
                      color: transparent;
                    `}
                  >
                    The best person in the world!
                  </a>
                </Link>
              )}
              {state.matches('viewing.user') && (
                <Link
                  href={routes.user(state.context.author.uid).url}
                  as={routes.user(state.context.author.uid).as}
                >
                  <a>{state.context.author.handle}</a>
                </Link>
              )}
              {authState.matches('auth') && state.matches('viewing.user') && (
                <span
                  css={css`
                    margin-left: 0.5rem;
                    padding-left: 0.5rem;
                    border-left: 1px solid lightgrey;
                  `}
                >
                  <button css={followButtonStyles}>Follow</button>
                </span>
              )}
            </h2>
          </div>

          {authState.matches('auth') && (
            <div
              css={css`
                display: flex;
              `}
            >
              {state.matches('viewing.user') && (
                <Button
                  css={css`
                    margin-right: 0.5rem;
                  `}
                >
                  Save
                </Button>
              )}
              <LikeButton
                post={state.context.post}
                user={authState.context.user}
              ></LikeButton>
            </div>
          )}
        </div>
      </header>

      <Carousel assets={post.assets}></Carousel>

      <p>{state.context.post.description}</p>

      <div>
        <h2>{state.context.post.comments.length} Comments</h2>
        <CommentsList
          comments={state.context.post.comments}
          user={state.context.user}
        ></CommentsList>
        <h3>Add a new comment</h3>
        <textarea name="" id="" cols={30} rows={10}></textarea>
        <Button>Post Comment</Button>
      </div>

      <div>
        <ul>
          <li>Likes: {state.context.post.likes.length}</li>
          <li>Views: {state.context.post.likes.length}</li>
          <li>Saves: {state.context.post.likes.length}</li>
          <li>
            Created: <ReadableDate date={new Date()}></ReadableDate>
          </li>
        </ul>
      </div>
    </div>
  );
}

interface CommentProps {
  comments: Comment[];
  user?: AuthUser;
}

function CommentsList(props: CommentProps) {
  let { comments, user } = props;

  return (
    <ul css={commentsStyles}>
      {comments.map((comment) => (
        <CommentItem comment={comment} user={user} key={comment.id}></CommentItem>
      ))}
    </ul>
  );
}

interface CommentItemProps {
  comment: Comment;
  user?: AuthUser;
}

let likeStateNode = {
  id: 'like',
  initial: 'idle',
  states: {
    idle: {
      on: {
        LIKE: { target: 'updating' },
        UNLIKE: { target: 'updating' },
      },
    },
    updating: {
      invoke: {
        src: 'update',
        onDone: { target: 'idle', actions: 'setLiked' },
        onError: { target: 'error', actions: 'setError' },
      },
    },
    error: {},
  },
};

let commentMachine = Machine({
  type: 'parallel',
  context: {
    liked: null,
    error: null,
  },
  states: {
    liking: {
      ...likeStateNode,
    },
    interacting: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            REPLY: 'replying',
          },
        },
        replying: {
          on: {
            SEND: 'sending',
            CANCEL: 'idle',
          },
        },
        sending: {},
        error: {},
      },
    },
  },
});

function CommentItem(props: CommentItemProps) {
  let { comment, user } = props;
  let [state, send] = useMachine(commentMachine, {
    // @ts-ignore
    context: { liked: comment.likes.includes(user.uid) },
    actions: {
      setError: assign({ error: (_: any, event: any) => event.data }),
      // @ts-ignore
      setLiked: assign({
        liked: (_: any, event: any) => event.data.likes.includes(user.uid),
      }),
    },
    services: {
      update(context, event) {
        if (event.type === 'LIKE') {
          return uploadCommentLike(comment, user);
        }
        if (event.type === 'UNLIKE') {
          return uploadCommentUnlike(comment, user);
        }
      },
    },
  });

  function handleLike(liked: boolean) {
    if (liked) {
      send('LIKE');
    } else {
      send('UNLIKE');
    }
  }

  function handleReply() {
    send('REPLY');
  }

  function handleCancel() {
    send('CANCEL');
  }

  if (state.matches('error')) {
    return <div>{state.context.error.message}</div>;
  }

  return (
    <li css={commentStyles} key={comment.id}>
      <p>{comment.body}</p>

      {state.matches('interacting.idle') && <button onClick={handleReply}>Reply</button>}
      {state.matches('interacting.replying') && (
        <>
          <textarea name="" id="" cols={30} rows={10}></textarea>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleCancel}>Send</button>
        </>
      )}

      <Like
        liked={state.context.liked}
        updating={state.matches('liking.updating')}
        onChange={handleLike}
      ></Like>
    </li>
  );
}

interface LikeProps {
  liked: boolean;
  updating?: boolean;
  onChange: (liked: boolean) => void;
}

function Like(props: LikeProps) {
  let { liked, updating, onChange } = props;

  function handleChange(event: any) {
    onChange(event.target.checked);
  }

  return (
    <ButtonToggle onChange={handleChange} checked={liked} disabled={updating}>
      {updating ? (
        <Spinner
          width={14}
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
      {updating ? 'Updating' : liked ? 'Liked' : 'Like'}
    </ButtonToggle>
  );
}

let commentsStyles = (theme: AppTheme) => css`
  list-style: none;
  margin: 0;
  padding: 0;
`;

let commentStyles = (theme: AppTheme) => css`
  background: ${theme.colors.itemBg};
  padding: 1rem;
  color: ${theme.colors.text};
  border-radius: 4px;
`;

PostPage.getInitialProps = async (context: PageContext) => {
  let postID = context.query.pid as string;
  let post;

  try {
    post = await fetchPost(postID);
  } catch (e) {
    throw e;
  }

  return { namespacesRequired: ['common'], post };
};

let avatarStyles = css`
  &:first-of-type {
    margin-right: 0.5rem;
  }
`;

let titleStyles = css`
  margin: 0;
  margin-bottom: 0.1rem;
  font-size: 1.2rem;
`;

let followButtonStyles = (theme: AppTheme) => css`
  background: 0;
  border: 0;
  padding: 0;
  color: ${theme.colors.textEm};
`;

let subtitleStyles = (theme: AppTheme) => css`
  margin: 0;
  font-size: 1em;
  font-weight: 400;
  color: ${theme.colors.textLight};
`;

// @ts-ignore
export default withTranslation('common')(PostPage);
