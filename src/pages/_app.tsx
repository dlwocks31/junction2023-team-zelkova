import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { DefaultSeo } from "next-seo";
import SEO from "../../seo.config";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      {/* TODO: type error */}
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
