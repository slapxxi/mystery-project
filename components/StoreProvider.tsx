import useAuth from '@self/lib/hooks/useAuth';
import useToast from '@self/lib/hooks/useToast';
import fetchPosts from '@self/lib/services/fetchPosts';
import fetchRecent from '@self/lib/services/fetchRecent';
import fetchSubscriptions from '@self/lib/services/fetchSubscriptions';
import { AuthUser, Post, PostCategory } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { createContext, ReactNode } from 'react';
import { assign, Machine, sendParent, spawn, State } from 'xstate';

export interface Context {
  category: PostCategory;
  posts: Post[];
  user: AuthUser;
  error: Error;
  likeMachine: any;
}

export interface StoreState extends State<Context> {}

interface Store {
  state: StoreState;
  send: any;
}

export let StoreContext = createContext({} as Store);
let { Provider } = StoreContext;

interface LikeMachineContext {
  error: Error;
  liking: Post;
}

let likeMachine = Machine<LikeMachineContext>(
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

export let storeMachine = Machine<Context>({
  initial: 'init',
  context: {
    user: null,
    posts: null,
    category: null,
    error: null,
    likeMachine: null,
  },
  states: {
    init: {
      on: {
        '': [{ target: 'idle', cond: 'dataProvided' }, { target: 'loading' }],
      },
    },
    idle: {
      on: {
        'LIKE.ERROR': { actions: ['setError', 'notify'] },
        CHANGE_CATEGORY: { target: 'loading', actions: ['setCategory'] },
      },
    },
    loading: {
      invoke: {
        src: 'fetchPosts',
        onDone: { target: 'idle', actions: ['setPosts'] },
        onError: { target: 'error', actions: ['setError'] },
      },
    },
    error: {
      entry: ['notify'],
    },
  },
  on: {
    LIKE: { actions: ['spawnLikeMachine'] },
  },
});

interface Props {
  posts?: Post[];
  children: ReactNode;
}

function StoreProvider(props: Props) {
  let { posts, children } = props;
  let [authState] = useAuth();
  let toast = useToast();

  let [state, send] = useMachine(storeMachine, {
    context: {
      posts,
      category: authState.matches('auth') ? 'following' : 'popular',
      user: authState.context.user,
    },
    guards: {
      dataProvided: (context) => !!context.posts,
    },
    actions: {
      spawnLikeMachine: assign({
        likeMachine: (context: any, event: any) =>
          spawn(likeMachine.withContext({ liking: event.payload, error: null })),
      }),
      setError: (context, event) => {
        context.error = event.payload;
      },
      setCategory: (context, event) => {
        context.category = event.payload;
      },
      setPosts: (context, event) => {
        context.posts = event.data;
      },
      notify: (context, event) => {
        toast({ message: context.error.message });
      },
    },
    services: {
      fetchPosts: (context) => {
        switch (context.category) {
          case 'popular':
            return fetchPosts();
          case 'following':
            return fetchSubscriptions(context.user);
          case 'recent':
            return fetchRecent();
        }
      },
    },
  });

  return <Provider value={{ state, send }}>{children}</Provider>;
}

export default StoreProvider;
