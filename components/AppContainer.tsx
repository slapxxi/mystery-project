import { AuthUser, Maybe, Post } from '@self/lib/types';
import { ComponentProps } from 'react';
import AuthProvider from './AuthProvider';
import Layout from './Layout';
import StoreProvider from './StoreProvider';
import ThemeProvider from './ThemeProvider';
import ToastProvider from './Toast';

interface Props extends ComponentProps<'div'> {
  user: Maybe<AuthUser>;
  posts: Maybe<Post[]>;
}

function AppContainer(props: Props) {
  let { children, user, posts } = props;

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider user={user}>
          <StoreProvider posts={posts}>
            <Layout>{children}</Layout>
          </StoreProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default AppContainer;
