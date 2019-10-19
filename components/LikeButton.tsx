/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import isLiked from '@self/lib/isLiked';
import uploadLike from '@self/lib/services/uploadLike';
import uploadUnlike from '@self/lib/services/uploadUnlike';
import { AuthUser, Post } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { assign, Machine } from 'xstate';
import ButtonToggle from './ButtonToggle';
import HeartIcon from './icons/HeartIcon';
import Spinner from './Spinner';

let likeMachine = Machine({
  initial: 'init',
  context: {
    post: null,
    user: null,
  },
  states: {
    init: {
      on: { '': [{ target: 'liked', cond: 'isLiked' }, { target: 'unliked' }] },
    },
    liked: { on: { UNLIKE: { target: 'updating' } } },
    unliked: { on: { LIKE: { target: 'updating' } } },
    updating: {
      invoke: {
        src: 'update',
        onDone: { target: 'init', actions: 'setPost' },
        onError: { target: 'error', actions: 'setError' },
      },
    },
    error: {},
  },
});

interface Context {
  post: Post;
  user: AuthUser;
  error: Error;
}

interface Props {
  post: Post;
  user: AuthUser;
}

function LikeButton(props: Props) {
  let { post, user } = props;
  let [state, send] = useMachine(likeMachine, {
    context: { post, user },
    actions: {
      setPost: assign<Context>({ post: (_, event) => event.data }),
      setError: assign<Context>({ error: (_, event) => event.data }),
    },
    guards: {
      isLiked(context) {
        if (context.user) {
          return isLiked(context.post, context.user);
        }
        return false;
      },
    },
    services: {
      update(context, event) {
        if (event.type === 'LIKE') {
          return uploadLike(context.post, context.user);
        } else {
          return uploadUnlike(context.post, context.user);
        }
      },
    },
  });

  return (
    <ButtonToggle
      onChange={(event) => (event.target.checked ? send('LIKE') : send('UNLIKE'))}
      checked={state.matches('liked')}
      disabled={state.matches('updating')}
    >
      {state.matches('updating') ? (
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
      {state.matches('liked') ? 'Liked' : state.matches('updating') ? 'Updating' : 'Like'}
    </ButtonToggle>
  );
}

export default LikeButton;
