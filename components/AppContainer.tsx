import { AuthUser, Maybe } from '@self/lib/types';
import { ComponentProps } from 'react';
import AuthProvider from './AuthProvider';
import Layout from './Layout';
import ThemeProvider from './ThemeProvider';
import ToastProvider from './Toast';

interface Props extends ComponentProps<'div'> {
  user: Maybe<AuthUser>;
}

function AppContainer(props: Props) {
  let { children, user } = props;

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider user={user}>
          <Layout>{children}</Layout>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default AppContainer;
