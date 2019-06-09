import { Auth, Maybe } from '@self/lib/types';
import { defaultTheme } from '@self/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { ComponentProps } from 'react';
import AuthProvider from './AuthProvider';
import Layout from './Layout';
import ToastProvider from './Toast';

interface Props extends ComponentProps<'div'> {
  user: Maybe<Auth.User>;
}

function AppContainer(props: Props) {
  let { children, user } = props;
  let root = typeof document === 'object' ? document.getElementById('root') : null;

  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastProvider innerRef={root}>
        <AuthProvider user={user}>
          <Layout>{children}</Layout>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default AppContainer;
