/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import uploadCommentLike from '@self/lib/services/uploadCommentLike';
import uploadCommentUnlike from '@self/lib/services/uploadCommentUnlike';
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
}

interface CommentItemProps {
  comment: Comment;
  user?: AuthUser;
}

interface CommentContext {
  liked: boolean;
  error: Error;
  user: AuthUser;
  comment: Comment;
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
  initial: 'init',
  context: {
    liked: null,
    error: null,
    user: null,
    comment: null,
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
    },
    anonymous: {},
  },
});

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

function CommentItem(props: CommentItemProps) {
  let { comment, user } = props;
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
    },
    actions: {
      setComment: assign({ comment: (_: any, event: any) => event.data }),
      setError: assign({ error: (_: any, event: any) => event.data }),
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

          <footer>
            {state.matches('auth') && (
              <>
                {state.matches('auth.interacting.idle') && (
                  <button onClick={handleReply}>Reply</button>
                )}
                {state.matches('auth.interacting.replying') && (
                  <>
                    <textarea name="" id="" cols={30} rows={10}></textarea>
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={handleCancel}>Send</button>
                  </>
                )}

                <Like
                  liked={state.context.liked}
                  updating={state.matches('auth.liking.updating')}
                  onChange={handleLike}
                ></Like>
              </>
            )}
            {/* <ReadableDate date={state.context.comment.createdAt}></ReadableDate> */}
            <HeartIcon width={14}></HeartIcon> {state.context.comment.likes.length}
          </footer>
        </div>
      </div>
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
