import { Auth, Maybe } from '@self/lib/types';
import { defaultTheme } from '@self/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { ComponentProps } from 'react';
import AuthStore from './AuthStore';
import Layout from './Layout';

interface Props extends ComponentProps<'div'> {
  user: Maybe<Auth.User>;
}

function AppContainer(props: Props) {
  let { children, user } = props;

  return (
    <ThemeProvider theme={defaultTheme}>
      <AuthStore user={user}>
        <Layout>{children}</Layout>
      </AuthStore>
    </ThemeProvider>
  );
}

export default AppContainer;
