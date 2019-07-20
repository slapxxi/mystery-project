import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    let initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
              window.addEventListener('load', () => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker
                    .register('/service-worker.js')
                    .then((result) => {
                      console.log('Service worker installed. Scope is', result.scope);
                    })
                    .catch((error) => {
                      console.log('Service worker registration failed with:', error);
                    });
                }
              });
            `,
            }}
          />
        </Head>
        <body id="root">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
