/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PostsGrid from '@self/components/PostsGrid';
import Spinner from '@self/components/Spinner';
import Toolbar from '@self/components/Toolbar';
import { withTranslation } from '@self/i18n';
import getUser from '@self/lib/getUser';
import useAuth from '@self/lib/hooks/useAuth';
import isServer from '@self/lib/isServer';
import fetchPosts from '@self/lib/services/fetchPosts';
import fetchRecent from '@self/lib/services/fetchRecent';
import fetchSubscriptions from '@self/lib/services/fetchSubscriptions';
import {
  AuthUser,
  Maybe,
  NormalizedPost,
  PageContext,
  PagePropsWithTranslation,
  Post,
  PostCategory,
} from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { assign, Machine } from 'xstate';

interface Props extends PagePropsWithTranslation<'common' | 'header'> {
  posts: NormalizedPost[];
  category: PostCategory;
}

interface Context {
  ssr: boolean;
  user: AuthUser;
  posts: Post[];
  category: PostCategory;
}

let pageMachine = Machine<Context>({
  initial: 'init',
  context: {
    ssr: null,
    user: null,
    posts: null,
    category: null,
  },
  states: {
    init: {
      on: {
        '': [
          { target: 'idle', cond: 'isSSR' },
          { target: 'loading', actions: ['setDefaultCategory'] },
        ],
      },
    },
    idle: {
      on: {
        CHANGE_CATEGORY: {
          target: 'loading',
          actions: 'setCategory',
        },
      },
    },
    loading: {
      invoke: {
        src: 'fetchCategory',
        onDone: { target: 'idle', actions: 'setPosts' },
        onError: 'error',
      },
    },
    error: {},
  },
});

function FeedPage(props: Props) {
  let { ssr, category, posts, t } = props;
  let [authState] = useAuth();
  let [state, send] = useMachine(pageMachine, {
    context: {
      ssr,
      category,
      posts: toPosts(posts),
      user: authState.context.user,
    },
    guards: {
      isSSR: (context) => context.ssr,
    },
    actions: {
      setCategory: assign<Context>({
        category: (context, event) => event.payload,
      }),
      setDefaultCategory: assign<Context>({
        category: (context, event) => (context.user ? 'following' : 'popular'),
      }),
      setPosts: assign<Context>({ posts: (context, event) => event.data }),
    },
    services: {
      fetchCategory: (context) => fetchCategory(context.category, context.user),
    },
  });

  function handleLike() {}

  function handleUnlike() {}

  return (
    <div>
      <Toolbar
        t={t}
        category={state.context.category}
        onChangeCategory={(category: PostCategory) =>
          send({ type: 'CHANGE_CATEGORY', payload: category })
        }
      ></Toolbar>

      {state.matches('error') && <div>Error occurred</div>}

      {state.matches('loading') && (
        <div
          css={css`
            margin: 0 auto;
            padding: 50px;
            text-align: center;
          `}
        >
          <Spinner></Spinner>
        </div>
      )}

      {state.matches('idle') && (
        <PostsGrid
          posts={state.context.posts}
          onLike={handleLike}
          onUnlike={handleUnlike}
        ></PostsGrid>
      )}
    </div>
  );
}

FeedPage.getInitialProps = async (context: PageContext) => {
  let user = getUser(context);
  let category: PostCategory = user ? 'following' : 'popular';
  let posts = await fetchCategory(category, user);
  let ssr = isServer(context);

  return { namespacesRequired: ['common', 'header'], posts, category, ssr };
};

function toPosts(posts: NormalizedPost[]): Post[] {
  return posts.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  }));
}

async function fetchCategory(category: PostCategory, user: Maybe<AuthUser>) {
  switch (category) {
    case 'popular':
      return fetchPosts();
    case 'following':
      return fetchSubscriptions(user);
    case 'recent':
      return fetchRecent();
    default:
      throw new Error('No valid match found');
  }
}

// @ts-ignore
export default withTranslation('common')(FeedPage);
