/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import routes from '@self/lib/routes';
import { PostCategory } from '@self/lib/types';
import styles from './Toolbar.styles';

interface Props {
  category: PostCategory;
  onChangeCategory: (category: PostCategory) => void;
  t: any;
}

function Toolbar(props: Props) {
  let { t, category, onChangeCategory } = props;
  let [authState] = useAuth();

  function handleChangeCategory(event: any) {
    if (onChangeCategory) {
      onChangeCategory(event.target.value);
    }
  }

  if (authState.matches('auth')) {
    return (
      <header css={styles.toolbar}>
        <div>
          <select
            name="category"
            id="post-category"
            value={category}
            onChange={handleChangeCategory}
          >
            <option value="popular">Popular</option>
            <option value="following">Following</option>
            <option value="recent">Recent</option>
          </select>
        </div>
        <div>
          <Link href={routes.posts.new.url}>
            <a href="">{t('create post')}</a>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header css={styles.toolbar}>
      <div>
        <select
          name="category"
          id="post-category"
          value={category}
          onChange={handleChangeCategory}
        >
          <option value="popular">Popular</option>
          <option value="recent">Recent</option>
        </select>
      </div>
    </header>
  );
}

export default Toolbar;
