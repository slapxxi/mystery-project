/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withNamespaces } from '@self/i18n';

interface Props extends I18nProps {}

function LoginPage(props: Props) {
  let { t } = props;

  return (
    <div>
      <h1>{t('login')}</h1>
      <button>Sign in with Github</button>
    </div>
  );
}

LoginPage.getInitialProps = async () => {
  return { namespacesRequired: ['common', 'header'] };
};

export default withNamespaces('common')(LoginPage);
