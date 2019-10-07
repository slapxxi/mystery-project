import { assign, Machine, sendParent } from 'xstate';
import { Post } from '../types';

interface Context {
  error: Error;
  liking: Post;
}

let likeMachine = Machine<Context>(
  {
    initial: 'liking',
    context: {
      error: null,
      liking: null,
    },
    states: {
      liking: {
        invoke: {
          src: 'like',
          onDone: { target: 'success' },
          onError: { target: 'error', actions: 'setError' },
        },
      },
      error: {
        entry: 'notify',
      },
      success: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      setError: assign({ error: (_, event) => event.data }),
      notify: sendParent((context, event) => {
        return { type: 'LIKE.ERROR', payload: context.error };
      }),
    },
    services: {
      like: () =>
        new Promise((res, rej) => {
          rej(new Error('oopsie daisy'));
        }),
    },
  }
);

export default likeMachine;
