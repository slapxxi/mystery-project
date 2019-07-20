import { AuthUser, Maybe } from '@self/lib/types';
import { defaultTheme } from '@self/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { ComponentProps } from 'react';
import AuthProvider from './AuthProvider';
import Layout from './Layout';
import ToastProvider from './Toast';

interface Props extends ComponentProps<'div'> {
  user: Maybe<AuthUser>;
}

function AppContainer(props: Props) {
  let { children, user } = props;

  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastProvider>
        <AuthProvider user={user}>
          <Layout>{children}</Layout>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default AppContainer;
