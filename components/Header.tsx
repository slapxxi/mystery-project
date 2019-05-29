/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from '@self/components/Link';
import { withNamespaces } from '@self/i18n';
import styles from './Header.styles';
import Logo from './Logo';
import Menu from './Menu';

interface Props extends I18nProps {}

function Header(props: Props) {
  let { t } = props;

  return (
    <header css={styles.header}>
      <ul css={styles.nav}>
        <li>
          <Menu t={t} />
        </li>
        <li>
          <Link href="/">
            <a>
              <Logo width="64" />
            </a>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <a>{t('login')}</a>
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default withNamespaces('header')(Header);
