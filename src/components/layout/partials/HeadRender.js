import Head from "next/head";

import { PageNameContext } from '@/context/PageNameContext';
import  { useContext } from 'react';

const HeadRender = () => {
  const { pageName, setPageName } = useContext(PageNameContext);


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
      <title>{pageName}</title>

    </Head>
  );
};

export default HeadRender;
