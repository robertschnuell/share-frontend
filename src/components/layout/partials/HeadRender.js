import Head from "next/head";


import getConfig from "next/config";

const HeadRender = () => {


  const config = getConfig().publicRuntimeConfig;
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link rel="manifest" href="./manifest.webmanifest" />
      <link rel="apple-touch-icon" href="./assets/icons/apple-touch-icon.png" />
      <link rel="icon" type="image/x-icon" href="./favicon.ico" sizes="16x16 32x32" />
      <link rel="icon" type="image/svg+xml" href="./favicon.svg" sizes="any" />
      <link rel="mask-icon" type="image/svg+xml" href="./favicon.svg" />
      <title>{config?.app?.name || "share"}</title>

    </Head>
  );
};

export default HeadRender;
