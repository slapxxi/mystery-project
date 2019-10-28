/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import GithubIcon from '@self/components/icons/GithubIcon';
import Spinner from '@self/components/Spinner';
import { Router, withTranslation } from '@self/i18n';
import useAuth from '@self/lib/hooks/useAuth';
import isServer from '@self/lib/isServer';
import redirectTo from '@self/lib/redirectTo';
import { AppTheme, PageContext, PagePropsWithTranslation } from '@self/lib/types';
import userAuthenticated from '@self/lib/universal/userAuthenticated';
import 'firebase/auth';

interface Props extends PagePropsWithTranslation<'common'> {}

function LoginPage(props: Props) {
  let { t } = props;
  let [auth, actions] = useAuth();

  if (auth.matches('auth')) {
    Router.push('/feed');

    return <div>Successfully Signed In</div>;
  }

  async function handleClick() {
    actions.signIn();
  }

  if (auth.matches('signingIn')) {
    return (
      <div>
        <Spinner></Spinner>
      </div>
    );
  }

  return (
    <div>
      <h1>{t('login')}</h1>
      <button
        data-testid="signin"
        onClick={handleClick}
        // disabled={auth.status === 'pending'}
        css={(theme: AppTheme) => css`
          display: inline-flex;
          align-items: center;
          border: 0;
          background-color: ${theme.type === 'light' ? 'black' : 'white'};
          color: ${theme.type === 'light' ? 'white' : 'black'};
          border-radius: 4px;
          padding: 10px;

          :hover {
            background-color: ${theme.type === 'light'
              ? 'hsl(0, 10%, 10%)'
              : 'hsl(0, 10%, 90%)'};
          }
        `}
      >
        <GithubIcon
          width={24}
          css={(theme: AppTheme) => css`
            fill: ${theme.type === 'light' ? 'white' : 'black'};
            margin-right: 10px;
            margin-top: -4px;
          `}
        ></GithubIcon>
        {t('sign in with github')}
      </button>
    </div>
  );
}

LoginPage.getInitialProps = async (context: PageContext) => {
  if (isServer(context) && userAuthenticated(context)) {
    redirectTo(context, '/');
  }

  return { namespacesRequired: ['common', 'header'] };
};

export default withTranslation('common')(LoginPage);
