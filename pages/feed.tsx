/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PostsGrid from '@self/components/PostsGrid';
import Spinner from '@self/components/Spinner';
import Toolbar from '@self/components/Toolbar';
import { withTranslation } from '@self/i18n';
import getUser from '@self/lib/getUser';
import useAuth from '@self/lib/hooks/useAuth';
import fetchPosts from '@self/lib/services/fetchPosts';
import fetchSubscriptions from '@self/lib/services/fetchSubscriptions';
import {
  AuthUser,
  Maybe,
  NormalizedPost,
  PageContext,
  PagePropsWithTranslation,
  Post,
  Subscription,
} from '@self/lib/types';
import { useMachine } from '@xstate/react';
import { assign, Machine } from 'xstate';

type PostCategory = 'following' | 'popular' | 'recent';

interface Props extends PagePropsWithTranslation<'common' | 'header'> {
  posts: NormalizedPost[];
  subscriptions?: Subscription[];
}

interface Context {
  user: Maybe<AuthUser>;
  subscriptions: Maybe<Subscription[]>;
  error: Maybe<Error>;
  category: PostCategory;
}

let pageMachine = Machine<Context>({
  id: 'feed-page',
  initial: 'idle',
  context: {
    user: null,
    subscriptions: null,
    error: null,
    category: 'popular',
  },
  states: {
    idle: {
      on: {
        '': [
          { target: 'success', cond: (context) => !!context.subscriptions },
          { target: 'loading', cond: (context) => !!context.user },
        ],
      },
    },
    loading: {
      invoke: {
        src: 'fetchSubscriptions',
        onDone: {
          target: 'success',
          actions: assign({ subscriptions: (_: Context, event: any) => event.data }),
        },
        onError: {
          target: 'error',
          actions: assign({ error: (_: Context, event: any) => event.data }),
        },
      },
    },
    error: {
      on: { RETRY: 'loading' },
    },
    success: {
      on: {
        CHANGE_CATEGORY: {
          target: 'loading',
          actions: ['setCategory'],
        },
      },
    },
  },
});

function FeedPage(props: Props) {
  let { posts, t } = props;
  let [authState] = useAuth();
  let [pageState, send] = useMachine(pageMachine, {
    context: { user: authState.context.user },
    services: {
      fetchSubscriptions: (context: Context) => fetchSubscriptions(context.user),
    },
    actions: {
      setCategory: (context, event) => {
        context.category = event.payload;
      },
    },
  });

  return (
    <div>
      <Toolbar
        t={t}
        category={pageState.context.category}
        onChangeCategory={(category: PostCategory) =>
          send({ type: 'CHANGE_CATEGORY', payload: category })
        }
      ></Toolbar>
      {pageState.matches('loading') ? (
        <Spinner></Spinner>
      ) : pageState.matches('success') ? (
        <>
          <PostsGrid posts={posts}></PostsGrid>
        </>
      ) : pageState.matches('error') ? (
        <>
          <span css={errorStyles}>{pageState.context.error.message}</span>
          <button onClick={() => send('RETRY')}>Retry</button>
        </>
      ) : null}
    </div>
  );
}

FeedPage.getInitialProps = async (context: PageContext) => {
  let user = getUser(context);
  let posts: Post[] = [];
  let subscriptions: Maybe<Subscription[]> = null;

  if (user) {
    subscriptions = await fetchSubscriptions(user);
  }

  posts = await fetchPosts();

  return { namespacesRequired: ['common', 'header'], posts, subscriptions };
};

let errorStyles = css`
  display: inline-block;
  background: tomato;
  padding: 10px;
  border-radius: 4px;
  color: hsl(0, 30%, 90%);
`;

// @ts-ignore
export default withTranslation('common')(FeedPage);
