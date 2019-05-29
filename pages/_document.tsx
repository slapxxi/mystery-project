import Document, {
  Head,
  Html,
  Main,
  NextDocumentContext,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: NextDocumentContext) {
    let initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body id="root">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
