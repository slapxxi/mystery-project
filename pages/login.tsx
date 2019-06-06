/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withNamespaces } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import isServer from '@self/lib/isServer';
import redirectTo from '@self/lib/redirectTo';
import firebaseConfig from '@self/lib/services/firebaseConfig';
import { Page } from '@self/lib/types';
import userAuthenticated from '@self/lib/userAuthenticated';
import firebase from 'firebase/app';
import 'firebase/auth';
import Router from 'next/router';

interface Props extends Page.Props {}

let app: firebase.app.App;

try {
  app = firebase.initializeApp(firebaseConfig);
} catch {
  app = firebase.app();
}

function LoginPage(props: Props) {
  let { t } = props;
  let [auth] = useAuth();

  if (auth.user) {
    Router.push('/feed');
  }

  function handleClick() {
    app.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
  }

  return (
    <div>
      <h1>{t('login')}</h1>
      <button onClick={handleClick}>Sign in with Github</button>
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
