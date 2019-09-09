/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link, Router, withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import isServer from '@self/lib/isServer';
import redirectTo from '@self/lib/redirectTo';
import routes from '@self/lib/routes';
import { PageContext, PagePropsWithTranslation } from '@self/lib/types';
import userAuthenticated from '@self/lib/universal/userAuthenticated';

interface Props extends PagePropsWithTranslation<'common'> {}

function ProfilePage(props: Props) {
  let { t } = props;
  let [auth, authActions] = useAuth();

  if (auth.matches('anonymous')) {
    Router.push('/');
  }

  function handleClick() {
    authActions.signOut();
  }

  return (
    <div>
      <h1>{t('profile')}</h1>
      <Link
        href={routes.user(auth.context.user.uid).url}
        as={routes.user(auth.context.user.uid).as}
      >
        <a href="">Your Page</a>
      </Link>
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
