import App, { Container, NextAppContext } from 'next/app';
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
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;
