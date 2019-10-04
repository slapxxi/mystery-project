/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PostsGrid from '@self/components/PostsGrid';
import Spinner from '@self/components/Spinner';
import Toolbar from '@self/components/Toolbar';
import { withTranslation } from '@self/i18n';
import getUser from '@self/lib/getUser';
import useStore from '@self/lib/hooks/useStore';
import fetchPosts from '@self/lib/services/fetchPosts';
import fetchSubscriptions from '@self/lib/services/fetchSubscriptions';
import {
  NormalizedPost,
  PageContext,
  PagePropsWithTranslation,
  Post,
  PostCategory,
  Subscription,
} from '@self/lib/types';

interface Props extends PagePropsWithTranslation<'common' | 'header'> {
  posts: NormalizedPost[];
  subscriptions?: Subscription[];
}

function FeedPage(props: Props) {
  let { t } = props;
  let [storeState, storeActions] = useStore();

  function handleLike(post: Post) {
    storeActions.like(post);
  }

  function handleUnlike(post: Post) {
    storeActions.unlike(post);
  }

  return (
    <div>
      <Toolbar
        t={t}
        category={storeState.context.category}
        onChangeCategory={(category: PostCategory) =>
          storeActions.changeCategory(category)
        }
      ></Toolbar>

      {storeState.matches('loading') && (
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

      {storeState.matches('idle') && (
        <PostsGrid
          posts={storeState.context.posts}
          onLike={handleLike}
          onUnlike={handleUnlike}
        ></PostsGrid>
      )}
    </div>
  );
}

FeedPage.getInitialProps = async (context: PageContext) => {
  let posts: Post[] = [];
  let user = getUser(context);

  if (user) {
    posts = await fetchSubscriptions(user);
  } else {
    posts = await fetchPosts();
  }

  return { namespacesRequired: ['common', 'header'] };
};

function toPosts(posts: NormalizedPost[]): Post[] {
  return posts.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  }));
}

let errorStyles = css`
  display: inline-block;
  background: tomato;
  padding: 10px;
  border-radius: 4px;
  color: hsl(0, 30%, 90%);
`;

// @ts-ignore
export default withTranslation('common')(FeedPage);
