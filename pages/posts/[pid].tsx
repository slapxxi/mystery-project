import { withTranslation } from '@self/i18n';
import fetchPost from '@self/lib/services/fetchPost';
import { PageContext, PagePropsWithTranslation, Post } from '@self/lib/types';
import ErrorPage from 'next/error';

interface Props extends PagePropsWithTranslation<'common'> {
  post: Post;
}

function PostPage(props: Props) {
  let { post, t } = props;

  if (!post) {
    return <ErrorPage statusCode={404}></ErrorPage>;
  }

  return (
    <div>
      <h1>{post.name}</h1>
      <p>{post.description}</p>
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

// @ts-ignore
export default withTranslation('common')(PostPage);
