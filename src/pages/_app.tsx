import { Toast } from "loplat-ui";
import { DefaultSeo } from "next-seo";
import { type AppType } from "next/app";
import Head from "next/head";
import "~/styles/globals.scss";
import { api } from "~/utils/api";
import SEO from "../../seo.config";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
        ></meta>
      </Head>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
      <Toast mx={4} my={4} />
    </>
  );
};

export default api.withTRPC(MyApp);
