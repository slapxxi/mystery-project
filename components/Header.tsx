/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Link from '@self/components/Link';
import { withNamespaces } from '@self/i18n';
import useMediaQuery from '@self/lib/hooks/useMediaQuery';
import mediaQueries from '@self/styles/mediaQueries';
import styles from './Header.styles';
import Logo from './Logo';
import Menu from './Menu';

interface Props extends I18nProps {}

function Header(props: Props) {
  let { t } = props;
  let matches = useMediaQuery(mediaQueries.tablet);

  return (
    <header css={styles.header}>
      <ul css={styles.nav}>
        <li
          css={css`
            order: ${matches ? 2 : 0};
          `}
        >
          <Link href="/login" passHref>
            <a css={styles.link}>{t('login')}</a>
          </Link>
        </li>
        <li
          css={css`
            order: ${matches ? 0 : 1};
          `}
        >
          <Link href="/">
            <a>
              <Logo css={styles.logo} />
            </a>
          </Link>
        </li>
        <li
          css={css`
            ${matches && 'flex: 1;'}
            order: ${matches ? 1 : 2};
          `}
        >
          {matches ? (
            <ul css={styles.menu}>
              <li>
                <Link href="/settings" passHref prefetch>
                  <a css={styles.link}>{t('settings')}</a>
                </Link>
              </li>
            </ul>
          ) : (
            <Menu t={t} />
          )}
        </li>
      </ul>
    </header>
  );
}

export default withNamespaces('header')(Header);
