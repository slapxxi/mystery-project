/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ActiveLink from '@self/components/ActiveLink';
import Link from '@self/components/Link';
import { withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import useMediaQuery from '@self/lib/hooks/useMediaQuery';
import { PagePropsWithTranslation } from '@self/lib/types';
import mediaQueries from '@self/styles/mediaQueries';
import Avatar from './Avatar';
import styles from './Header.styles';
import Logo from './Logo';
import Menu from './Menu';

interface Props extends PagePropsWithTranslation<'header'> {}

function Header(props: Props) {
  let { t } = props;
  let [auth] = useAuth();
  let matches = useMediaQuery(mediaQueries.tablet);

  return (
    <header css={styles.header}>
      <ul css={styles.nav}>
        <li
          css={css`
            flex: ${matches ? -1 : 1};
            order: ${matches ? 2 : 0};
          `}
        >
          {auth.user ? (
            <Avatar user={auth.user} />
          ) : (
            <ActiveLink href="/login" passHref>
              <a css={styles.signinLink}>{t('login')}</a>
            </ActiveLink>
          )}
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
            flex: 1;
            text-align: right;
            order: ${matches ? 1 : 2};
          `}
        >
          {matches ? (
            <ul css={styles.menu}>
              <li>
                <ActiveLink href="/test" passHref>
                  <a css={styles.link}>Test</a>
                </ActiveLink>
              </li>
              <li>
                <ActiveLink href="/feed" passHref prefetch>
                  <a css={styles.link}>{t('feed')}</a>
                </ActiveLink>
              </li>
              <li>
                <ActiveLink href="/settings" passHref prefetch>
                  <a css={styles.link}>{t('settings')}</a>
                </ActiveLink>
              </li>
            </ul>
          ) : (
            <Menu t={t} user={auth.user} />
          )}
        </li>
      </ul>
    </header>
  );
}

export default withTranslation('header')(Header);
