import AppContainer from '@self/components/AppContainer';
import { appWithTranslation } from '@self/i18n';
import App, { Container as NextContainer, NextAppContext } from 'next/app';
import React from 'react';

class MyApp extends App {
  static async getInitialProps(context: NextAppContext) {
    let { Component, ctx } = context;
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    let { Component, pageProps } = this.props;

    return (
      <NextContainer>
        <AppContainer>
          <Component {...pageProps} />
        </AppContainer>
      </NextContainer>
    );
  }
}

export default appWithTranslation(MyApp);
