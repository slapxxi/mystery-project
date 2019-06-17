import AppContainer from '@self/components/AppContainer';
import { appWithTranslation } from '@self/i18n';
import { AppContext, AppProps } from '@self/lib/types';
import App, { Container as NextContainer } from 'next/app';
import React from 'react';

class MyApp extends App {
  static async getInitialProps(context: AppContext) {
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
      <NextContainer>
        <AppContainer user={pageProps.user}>
          <Component {...pageProps} />
        </AppContainer>
      </NextContainer>
    );
  }
}

export default appWithTranslation(MyApp);
