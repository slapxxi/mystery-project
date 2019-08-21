/** @jsx jsx */
import { jsx } from '@emotion/core';
import PostsGrid from '@self/components/PostsGrid';
import { Link, withTranslation } from '@self/i18n';
import getUser from '@self/lib/getUser';
import useAuth from '@self/lib/hooks/useAuth';
import routes from '@self/lib/routes';
import fetchPosts from '@self/lib/services/fetchPosts';
import fetchSubscriptions from '@self/lib/services/fetchSubscriptions';
import {
  Maybe,
  PageContext,
  PagePropsWithTranslation,
  Post,
  Subscription,
} from '@self/lib/types';
import { useEffect, useState } from 'react';

interface Props extends PagePropsWithTranslation<'common' | 'header'> {
  posts: Post[];
  subscriptions?: Subscription[];
}

function FeedPage(props: Props) {
  let { posts, subscriptions, t } = props;
  let [authState] = useAuth();
  let [subs, setSubs] = useState(null);

  useEffect(() => {
    let worker = new Worker('@self/store.worker', { type: 'module' });

    worker.postMessage({ type: 'init' });

    if (authState.user && !subscriptions) {
      fetchSubscriptions(authState.user).then((subs) => {
        setSubs(subs);
      });
    }
  }, []);

  if (authState.user && (!!subs || !!subscriptions)) {
    return (
      <div>
        <nav>
          <Link href={routes.posts.new.url}>
            <a>{t('create post')}</a>
          </Link>
        </nav>
        <h2>{t('following')}</h2>

        <PostsGrid posts={subscriptions || subs}></PostsGrid>

        <h2>{t('popular')}</h2>
        <PostsGrid posts={posts}></PostsGrid>
      </div>
    );
  }

  return (
    <div>
      <h1>{t('feed')}</h1>
      <PostsGrid posts={posts}></PostsGrid>
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

// @ts-ignore
export default withTranslation('common')(FeedPage);
