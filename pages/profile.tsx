/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Router, withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import isServer from '@self/lib/isServer';
import redirectTo from '@self/lib/redirectTo';
import { PageContext, PagePropsWithTranslation } from '@self/lib/types';
import userAuthenticated from '@self/lib/universal/userAuthenticated';

interface Props extends PagePropsWithTranslation<'common'> {}

function ProfilePage(props: Props) {
  let { t } = props;
  let [auth, authActions] = useAuth();

  if (!auth.user) {
    Router.push('/');
  }

  function handleClick() {
    authActions.requestSignOut();
  }

  return (
    <div>
      <h1>{t('profile')}</h1>
      <button onClick={handleClick}>Sign Out</button>
    </div>
  );
}

ProfilePage.getInitialProps = async (context: PageContext) => {
  if (isServer(context) && !userAuthenticated(context)) {
    redirectTo(context, '/');
  }

  return { namespacesRequired: ['common', 'header'] };
};

export default withTranslation('common')(ProfilePage);
