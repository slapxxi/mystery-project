import Carousel from '@self/components/Carousel';
import Spinner from '@self/components/Spinner';
import { Link, withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import routes from '@self/lib/routes';
import fetchPost from '@self/lib/services/fetchPost';
import fetchUser from '@self/lib/services/fetchUser';
import { PageContext, PagePropsWithTranslation, Post } from '@self/lib/types';
import { useMachine } from '@xstate/react';
import ErrorPage from 'next/error';
import { assign, Machine } from 'xstate';

interface Props extends PagePropsWithTranslation<'common'> {
  post: Post;
}

let pageMachine = Machine({
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

// todo: eliminate layout shifting while content is loading
function PostPage(props: Props) {
  let { post, t } = props;
  let [authState] = useAuth();
  let [pageState, send] = useMachine(pageMachine, {
    context: { post, user: authState.user },
    guards: {
      isAuth: (context) =>
        context.user && context.post && context.user.uid === context.post.author,
    },
    services: { fetchAuthor: (context) => fetchUser(context.post.author) },
  });

  if (pageState.matches('error.notFound')) {
    return <ErrorPage statusCode={404}></ErrorPage>;
  }

  if (pageState.matches('editing')) {
    return (
      <div>
        <h1>{t('editing')}</h1>
        <button onClick={() => send('CANCEL')}>{t('cancel')}</button>
      </div>
    );
  }

  if (pageState.matches('viewing.auth')) {
    return (
      <div>
        <div>
          <button onClick={() => send('EDIT')}>{t('edit')}</button>
        </div>
        <hgroup>
          <h1>{post.title}</h1>
          <span>Created by You</span>
        </hgroup>
        <p>{post.description}</p>

        {post.assets && <Carousel assets={post.assets}></Carousel>}
      </div>
    );
  }

  if (pageState.matches('viewing.loading') || pageState.matches('viewing.user')) {
    return (
      <div>
        <hgroup>
          <h1>{post.title}</h1>
          <span>
            Created by{' '}
            {pageState.matches('viewing.loading') ? (
              <Spinner></Spinner>
            ) : (
              <Link href={routes.user(post.author).url} as={routes.user(post.author).as}>
                <a>{pageState.context.author.handle}</a>
              </Link>
            )}
          </span>
        </hgroup>
        <p>{post.description}</p>
        {post.assets && <Carousel assets={post.assets}></Carousel>}
      </div>
    );
  }

  return null;
}

PostPage.getInitialProps = async (context: PageContext) => {
  let postID = context.query.pid as string;
  let post;

  try {
    post = await fetchPost(postID);
  } catch {}

  return { namespacesRequired: ['common'], post };
};

// @ts-ignore
export default withTranslation('common')(PostPage);
