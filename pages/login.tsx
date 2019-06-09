/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withNamespaces } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import isServer from '@self/lib/isServer';
import redirectTo from '@self/lib/redirectTo';
import { Page } from '@self/lib/types';
import userAuthenticated from '@self/lib/userAuthenticated';
import 'firebase/auth';
import Router from 'next/router';

interface Props extends Page.Props {}

function LoginPage(props: Props) {
  let { t } = props;
  let [auth, actions] = useAuth();

  if (auth.user) {
    Router.push('/feed');
  }

  async function handleClick() {
    actions.requestSignIn();
  }

  return (
    <div>
      <h1>{t('login')}</h1>
      <button onClick={handleClick} disabled={auth.status === 'pending'}>
        Sign in with Github
      </button>
    </div>
  );
}

LoginPage.getInitialProps = async (context: Page.Context) => {
  if (isServer(context) && userAuthenticated(context)) {
    redirectTo(context, '/');
  }

  return { namespacesRequired: ['common', 'header'] };
};

export default withNamespaces('common')(LoginPage);
