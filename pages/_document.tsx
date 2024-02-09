import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="icon"
          href=" https://www.google.com/s2/favicons?domain=https://garciadev.netlify.app"
          type="image/png"
        />
      </Head>
      <body className="text-white bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
