import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.scss";
import { DefaultSeo } from "next-seo";
import SEO from "../../seo.config";
import { Toast } from "loplat-ui";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
      <Toast mx={4} my={4} />
    </>
  );
};

export default api.withTRPC(MyApp);
