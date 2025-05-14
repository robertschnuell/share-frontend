import "../styles.css";


import Layout from "@/components/layout/default";
import { useEffect, useState } from "react";
import { PageNameProvider } from "@/context/PageNameContext";

import HeadRender from '@/components/layout/partials/HeadRender';

function App({ Component, pageProps }) {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) return <></>;

  return (
    <PageNameProvider>
     <HeadRender />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PageNameProvider>
  );
}

export default App;