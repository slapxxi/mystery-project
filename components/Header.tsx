import Link from '@self/components/Link';
import { withNamespaces } from '@self/i18n';

function Header(props) {
  let { t } = props;

  return (
    <header>
      <ul>
        <li>
          <Link href="/">
            <a>{t('index')}</a>
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <a>{t('settings')}</a>
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default withNamespaces('header')(Header);
