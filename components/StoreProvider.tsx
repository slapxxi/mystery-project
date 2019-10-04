import useAuth from '@self/lib/hooks/useAuth';
import useToast from '@self/lib/hooks/useToast';
import fetchPosts from '@self/lib/services/fetchPosts';
import fetchRecent from '@self/lib/services/fetchRecent';
import fetchSubscriptions from '@self/lib/services/fetchSubscriptions';
import { AuthUser, Post, PostCategory } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { createContext, ReactNode } from 'react';
import { Machine, State } from 'xstate';

export interface StoreContext {
  category: PostCategory;
  posts: Post[];
  user: AuthUser;
}

export interface StoreState extends State<StoreContext> {}

interface Store {
  state: StoreState;
  send: any;
}

export let StoreContext = createContext({} as Store);
let { Provider } = StoreContext;

let likeMachine = Machine({
  initial: 'idle',
  context: {
    error: null,
    liking: null,
  },
  states: {
    idle: {
      on: {
        LIKE: { target: 'liking', actions: ['setLiking'] },
        UNLIKE: { target: 'unliking', actions: ['setLiking'] },
      },
    },
    liking: {
      invoke: {
        src: 'like',
        onDone: { target: 'success' },
        onError: { target: 'error', actions: ['setError'] },
      },
    },
    unliking: {
      invoke: {
        src: 'unlike',
        onDone: { target: 'success' },
        onError: { target: 'error', actions: ['setError'] },
      },
    },
    error: {
      entry: ['notify'],
      on: {
        DISMISS: { target: 'idle', actions: ['clearErrors'] },
      },
    },
    success: {
      type: 'final',
    },
  },
});

export let storeMachine = Machine({
  initial: 'init',
  context: {
    user: null,
    posts: null,
    category: null,
    syncing: null,
    liking: null,
    filters: null,
    error: null,
  },
  states: {
    init: {
      on: {
        '': [{ target: 'idle', cond: 'dataProvided' }, { target: 'loading' }],
      },
    },
    idle: {
      on: {
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
