/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Link } from '@self/i18n';
import routes from '@self/lib/routes';
import { Post } from '@self/lib/types';

interface Props {
  posts: Post[];
}

function PostsGrid(props: Props) {
  let { posts } = props;

  return (
    <ul
      css={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
        list-style: none;
        margin: 20px;
        padding: 0;
      `}
    >
      {posts.map((p) => (
        <li key={p.id}>
          <h3>
            <Link href={routes.post(p.id).url} as={routes.post(p.id).as}>
              <a>{p.title}</a>
            </Link>
          </h3>
          <p>{p.description}</p>
        </li>
      ))}
    </ul>
  );
}

export default PostsGrid;
