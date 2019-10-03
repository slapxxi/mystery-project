/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link } from '@self/i18n';
import routes from '@self/lib/routes';
import { NormalizedPost, Post } from '@self/lib/types';
import { format } from 'date-fns';
import Button from './Button';
import * as styles from './PostsGrid.styles';

interface Props {
  posts: (Post | NormalizedPost)[];
}

function PostsGrid(props: Props) {
  let { posts } = props;

  return (
    <ul css={styles.container}>
      {posts.map((p) => (
        <li key={p.id} css={styles.item}>
          <header css={styles.header}>
            <div>
              <h3 css={styles.title}>
                <Link href={routes.post(p.id).url} as={routes.post(p.id).as}>
                  <a>{p.title}</a>
                </Link>
              </h3>
              {p.createdAt ? (
                <time css={styles.time}>
                  {format(new Date(p.createdAt), 'MMMM dd, y', {})}
                </time>
              ) : null}
            </div>
            <div>
              <Button>Save</Button>
              <Button>Like</Button>
            </div>
          </header>
          <img src={p.assets[0]} alt="" css={styles.image} />
          <footer css={styles.footer}>
            <span>0 Views</span>
            <span>0 Likes</span>
            <span>0 Comments</span>
          </footer>
        </li>
      ))}
    </ul>
  );
}

export default PostsGrid;
