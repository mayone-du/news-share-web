import Document, { Head, Html, Main, NextScript } from "next/document";
import { createGetInitialProps } from "@mantine/next";

const getInitialProps = createGetInitialProps();

export default class MyDocument extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="ja">
        <Head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#"></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
