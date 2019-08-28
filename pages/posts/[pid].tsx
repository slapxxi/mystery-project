import Carousel from '@self/components/Carousel';
import { withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import fetchPost from '@self/lib/services/fetchPost';
import { AuthUser, PageContext, PagePropsWithTranslation, Post } from '@self/lib/types';
import ErrorPage from 'next/error';

interface Props extends PagePropsWithTranslation<'common'> {
  post: Post;
}

function PostPage(props: Props) {
  let { post, t } = props;
  let [authState] = useAuth();

  if (!post) {
    return <ErrorPage statusCode={404}></ErrorPage>;
  }

  return (
    <div>
      {createdByUser(post, authState.user) ? (
        <div>
          <button>Edit</button>
        </div>
      ) : null}
      <h1>{post.title}</h1>
      <p>{post.description}</p>

      {post.assets && <Carousel assets={post.assets}></Carousel>}
    </div>
  );
}

PostPage.getInitialProps = async (context: PageContext) => {
  let postID = context.query.pid as string;
  let post;

  try {
    post = await fetchPost(postID);
  } catch {}

  return { namespacesRequired: ['common'], post };
};

function createdByUser(post: Post, user: AuthUser) {
  if (post && user && post.author) {
    return post.author.uid === user.uid;
  }
  return false;
}

// @ts-ignore
export default withTranslation('common')(PostPage);
