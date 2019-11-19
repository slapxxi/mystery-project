/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Avatar from '@self/components/Avatar';
import Button from '@self/components/Button';
import Carousel from '@self/components/Carousel';
import CommentForm from '@self/components/CommentForm';
import CommentsList from '@self/components/CommentsList';
import LikeButton from '@self/components/LikeButton';
import ReadableDate from '@self/components/ReadableDate';
import { Link, withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import routes from '@self/lib/routes';
import fetchPost from '@self/lib/services/fetchPost';
import fetchUser from '@self/lib/services/fetchUser';
import uploadComment from '@self/lib/services/uploadComment';
import {
  AppTheme,
  AuthUser,
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
  comment: string;
  error: Error;
}

let uploadStateNode = {
  initial: 'idle',
  states: {
    idle: {},
    uploading: {
      invoke: {
        src: 'upload',
        onDone: { target: 'idle', actions: ['resetValue', 'setPost'] },
        onError: { target: 'error', actions: 'setError' },
      },
    },
    error: {
      on: {
        RETRY: 'uploading',
      },
    },
  },
};

let pageMachine = Machine<Context>({
  id: 'post-machine',
  initial: 'idle',
  context: {
    user: null,
    post: null,
    author: null,
    comment: null,
    error: null,
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
        user: {
          ...uploadStateNode,
          on: {
            CHANGE_COMMENT: { actions: 'setComment' },
            SUBMIT_COMMENT: '.uploading',
          },
        },
        auth: {
          ...uploadStateNode,
          on: {
            EDIT: '#editing',
            CHANGE_COMMENT: { actions: 'setComment' },
            SUBMIT_COMMENT: '.uploading',
          },
        },
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
  let { post } = props;
  let [authState] = useAuth();
  let [state, send] = useMachine<Context, any>(pageMachine, {
    context: { post, user: authState.context.user, comment: '' },
    actions: {
      setComment: assign({ comment: (_, event) => event.payload }),
      setPost: assign({ post: (_, event) => event.data }),
      setError: assign({ error: (_, event) => event.data }),
      resetValue: assign({ comment: '' }),
    },
    guards: {
      isAuth: (context) =>
        context.user && context.post && context.user.uid === context.post.author,
    },
    services: {
      fetchAuthor: (context) => fetchUser(context.post.author),
      upload: (context) => uploadComment(context.post, context.user, context.comment),
    },
  });

  if (state.matches('error.notFound')) {
    return <ErrorPage statusCode={404}></ErrorPage>;
  }

  function handleChangeComment(value: string) {
    send({ type: 'CHANGE_COMMENT', payload: value });
  }

  function handleSubmitComment(value: string) {
    send('SUBMIT_COMMENT');
  }

  return (
    <div
      css={css`
        max-width: 840px;
        margin: 0 auto;
      `}
    >
      <header
        css={css`
          display: flex;
          padding: 0.5rem 0;

          @media screen and (min-width: 640px) {
            padding: 1rem 0;
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

      <div
        css={css`
          display: flex;
          flex-direction: column;

          @media screen and (min-width: 960px) {
            flex-direction: row;
          }
        `}
      >
        <section
          css={css`
            @media screen and (min-width: 960px) {
              flex: 2;
            }
          `}
        >
          <div>
            <p
              css={css`
                padding-bottom: 1rem;
                border-bottom: 1px solid lightgrey;
              `}
            >
              {state.context.post.description}
            </p>
          </div>
          <div>
            <h2
              css={css`
                font-size: 1.2em;
              `}
            >
              {state.context.post.comments.length} Responses
            </h2>

            <CommentsList
              comments={state.context.post.comments}
              user={state.context.user}
            ></CommentsList>

            {authState.matches('auth') && (
              <CommentForm
                value={state.context.comment}
                onChange={handleChangeComment}
                onSubmit={handleSubmitComment}
              ></CommentForm>
            )}
          </div>
        </section>

        <aside>
          <ul>
            <li>Tags: post, unique, value</li>
            <li>Likes: {state.context.post.likes.length}</li>
            <li>Views: {state.context.post.likes.length}</li>
            <li>Saves: {state.context.post.likes.length}</li>
            <li>Comments: {state.context.post.comments.length}</li>
            <li>
              Created: <ReadableDate date={new Date()}></ReadableDate>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

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
