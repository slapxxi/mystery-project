/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import uploadCommentLike from '@self/lib/services/uploadCommentLike';
import uploadCommentUnlike from '@self/lib/services/uploadCommentUnlike';
import uploadReply from '@self/lib/services/uploadReply';
import { AppTheme, AuthUser, Comment } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { assign, Machine } from 'xstate';
import Avatar from './Avatar';
import ButtonToggle from './ButtonToggle';
import HeartIcon from './icons/HeartIcon';
import Spinner from './Spinner';

interface CommentProps {
  comments: Comment[];
  user?: AuthUser;
  onDelete: (comment: Comment) => void;
}

interface CommentItemProps {
  comment: Comment;
  user?: AuthUser;
  onDelete: (comment: Comment) => void;
}

interface CommentContext {
  liked: boolean;
  error: Error;
  user: AuthUser;
  comment: Comment;
  reply: string;
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
        onDone: { target: 'idle', actions: ['setLiked', 'setComment'] },
        onError: { target: 'error', actions: 'setError' },
      },
    },
    error: {},
  },
};

let commentMachine = Machine<CommentContext>({
  id: 'comment',
  initial: 'init',
  context: {
    liked: null,
    error: null,
    user: null,
    comment: null,
    reply: null,
  },
  states: {
    init: {
      on: {
        '': [{ target: 'auth', cond: 'isAuth' }, { target: 'anonymous' }],
      },
    },
    auth: {
      type: 'parallel',
      states: {
        status: {
          initial: 'init',
          states: {
            init: {
              on: {
                '': [{ target: 'owned', cond: 'isOwner' }, { target: 'private' }],
              },
            },
            owned: {
              on: {
                DELETE: {
                  target: '#comment.auth.interacting.deleting',
                  cond: 'isConfirmed',
                },
              },
            },
            private: {},
          },
        },
        liking: {
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
                onDone: { target: 'idle', actions: ['setLiked', 'setComment'] },
                onError: { target: 'error', actions: 'setError' },
              },
            },
            error: {},
          },
        },
        interacting: {
          initial: 'idle',
          states: {
            idle: {
              on: { REPLY: 'replying' },
            },
            deleting: {
              entry: 'deleteComment',
            },
            replying: {
              on: {
                CHANGE: { actions: 'setReply' },
                SEND: 'sending',
                CANCEL: 'idle',
              },
            },
            sending: {
              invoke: {
                src: 'postReply',
                onDone: { target: 'idle', actions: ['setComment', 'clearReply'] },
                onError: { target: 'error', actions: 'setError' },
              },
            },
            error: {
              on: {
                RETRY: 'sending',
                CANCEL: 'idle',
              },
            },
          },
        },
      },
    },
    anonymous: {},
  },
});

function CommentsList(props: CommentProps) {
  let { comments, user, onDelete } = props;

  function handleDelete(comment: Comment) {
    onDelete(comment);
  }

  return (
    <ul css={commentsStyles}>
      {comments.map((comment) => (
        <CommentItem
          comment={comment}
          user={user}
          key={comment.id}
          onDelete={handleDelete}
        ></CommentItem>
      ))}
    </ul>
  );
}

function CommentItem(props: CommentItemProps) {
  let { comment, user, onDelete } = props;
  let [state, send] = useMachine<CommentContext, any>(commentMachine, {
    context: {
      user,
      comment,
      liked: user && comment.likes.includes(user.uid),
    },
    guards: {
      isAuth(context) {
        return !!context.user;
      },
      isOwner(context) {
        return context.user.uid === context.comment.author.uid;
      },
      isConfirmed() {
        return confirm('Are you sure you want to delete this comment?');
      },
    },
    actions: {
      setComment: assign<CommentContext>({ comment: (_, event) => event.data }),
      setError: assign<CommentContext>({ error: (_, event) => event.data }),
      setReply: assign<CommentContext>({ reply: (_, event) => event.payload }),
      clearReply: assign<CommentContext>({ reply: (_, event) => null }),
      setLiked: assign<CommentContext>({
        liked: (_, event) => event.data.likes.includes(user.uid),
      }),
      deleteComment: (context) => onDelete(context.comment),
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
      postReply(context, event) {
        let { comment, user, reply } = context;
        return uploadReply(comment, user, reply);
      },
    },
  });

  function handleLikeButton() {
    if (state.context.liked) {
      send('UNLIKE');
    } else {
      send('LIKE');
    }
  }

  function handleReply() {
    send('REPLY');
  }

  function handleCancel() {
    send('CANCEL');
  }

  function handleSendReply() {
    send('SEND');
  }

  function handleRetry() {
    send('RETRY');
  }

  function handleDelete() {
    send('DELETE');
  }

  function handleChangeReply(event: any) {
    send({ type: 'CHANGE', payload: event.target.value });
  }

  if (state.matches('error')) {
    return <div>{state.context.error.message}</div>;
  }

  return (
    <li css={commentStyles} key={state.context.comment.id}>
      <div
        css={css`
          display: flex;
          align-items: flex-start;
        `}
      >
        <Avatar
          size="38px"
          user={state.context.comment.author}
          css={css`
            margin-right: 1rem;
            margin-top: 2px;
          `}
        ></Avatar>
        <div>
          <h1
            css={css`
              margin: 0;
              font-size: 1em;
            `}
          >
            {state.context.comment.author.name}
          </h1>
          <p>{state.context.comment.body}</p>

          <footer
            css={css`
              display: flex;
              flex-wrap: wrap;
              align-items: center;
            `}
          >
            {state.matches('auth') && (
              <>
                {state.matches('auth.status.owned') && (
                  <button onClick={handleDelete}>Delete</button>
                )}

                {state.matches('auth.interacting.idle') && (
                  <button
                    onClick={handleReply}
                    css={(theme) => css`
                      ${textButtonStyles(theme)}
                      margin-right: 1rem;
                    `}
                  >
                    Reply
                  </button>
                )}
                {state.matches('auth.interacting.sending') && (
                  <div>
                    <Spinner></Spinner>
                  </div>
                )}
                {state.matches('auth.interacting.error') && (
                  <div>
                    <span>Error sending reply</span>
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={handleRetry}>Retry</button>
                  </div>
                )}
                <button css={textButtonStyles} onClick={handleLikeButton}>
                  <HeartIcon
                    width={14}
                    css={css`
                      margin-right: 0.2rem;
                      fill: ${state.matches('auth.liking.updating')
                        ? 'slategrey'
                        : state.context.liked
                        ? 'hotpink'
                        : 'grey'};
                    `}
                  ></HeartIcon>{' '}
                  {state.context.comment.likes.length}
                </button>

                {state.matches('auth.interacting.replying') && (
                  <div
                    css={css`
                      flex: 1 100%;
                    `}
                  >
                    <textarea
                      name=""
                      id=""
                      cols={30}
                      rows={10}
                      value={state.context.reply}
                      onChange={handleChangeReply}
                    ></textarea>
                    <div>
                      <button onClick={handleCancel}>Cancel</button>
                      <button onClick={handleSendReply}>Send</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </footer>
        </div>
      </div>

      <ul
        css={css`
          margin: 0;
          margin-left: 1rem;
          list-style: none;
        `}
      >
        {state.context.comment.replies.map((r) => (
          <li key={r.id}>
            <h2
              css={css`
                display: flex;
                align-items: center;
                font-size: 1em;
              `}
            >
              <Avatar
                user={r.author}
                css={css`
                  margin-right: 1rem;
                `}
              ></Avatar>
              {r.author.name}
            </h2>
            {r.body}
          </li>
        ))}
      </ul>
    </li>
  );
}

const textButtonStyles = (theme: AppTheme) => css`
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: 0;
  :hover {
    color: ${theme.colors.textEm};
  }
`;

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

  & > li {
    border-bottom: 1px solid ${theme.colors.textLight};
  }
`;

let commentStyles = (theme: AppTheme) => css`
  padding: 0;
  padding-bottom: 1rem;
  margin: 0;
  margin-bottom: 1rem;
  color: ${theme.colors.text};
`;

export default CommentsList;
