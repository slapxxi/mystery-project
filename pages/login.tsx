/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Router, withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import isServer from '@self/lib/isServer';
import redirectTo from '@self/lib/redirectTo';
import { PageContext, PageProps } from '@self/lib/types';
import userAuthenticated from '@self/lib/universal/userAuthenticated';
import 'firebase/auth';

interface Props extends PageProps {}

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
      <button
        data-testid="signin"
        onClick={handleClick}
        disabled={auth.status === 'pending'}
      >
        {t('sign in with github')}
      </button>
    </div>
  );
}

LoginPage.getInitialProps = async (context: PageContext) => {
  if (isServer(context) && userAuthenticated(context.req)) {
    redirectTo(context, '/');
  }

  return { namespacesRequired: ['common', 'header'] };
};

export default withTranslation('common')(LoginPage);
