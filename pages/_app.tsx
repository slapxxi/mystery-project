import AppContainer from '@self/components/AppContainer';
import { appWithTranslation } from '@self/i18n';
import { AppProps } from '@self/lib/types';
import App from 'next/app';
import React from 'react';

class MyApp extends App {
  static async getInitialProps(context: any) {
    let { Component, ctx } = context;
    let { req } = ctx;
    let pageProps: AppProps = { user: null };

    if (req) {
      let { session } = req;

      if (session && session.decodedToken) {
        pageProps = { ...pageProps, user: session.decodedToken };
      }
    }

    if (Component.getInitialProps) {
      pageProps = {
        ...pageProps,
        ...(await Component.getInitialProps(ctx)),
      };
    }

    return { pageProps };
  }

  render() {
    let { Component, pageProps } = this.props;

    return (
      <AppContainer user={pageProps.user} posts={pageProps.posts}>
        <Component {...pageProps} />
      </AppContainer>
    );
  }
}

export default appWithTranslation(MyApp);
