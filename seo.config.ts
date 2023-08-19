import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  titleTemplate: "%s | Junction Asia 2022",
  openGraph: {
    type: "website",
    site_name: "pick-up-bob",
    images: [
      {
        url: "https://team-zelkova.vercel.app/thumbnail-512x512.png",
      },
    ],
  },
  additionalLinkTags: [
    {
      rel: "shortcut icon",
      href: "/favicon.ico",
    },
    // 글꼴
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    // manifest
    {
      rel: "manifest",
      href: "/manifest.json",
    },
    // iOS
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/thumbnail-180x180.png",
    },
  ],
  additionalMetaTags: [
    {
      name: "description",
      content: "Junction Asia 2022 AWS GameTech",
    },
    {
      name: "application-name",
      content: "pick-up-bob",
    },
    // iOS
    {
      name: "apple-mobile-web-app-title",
      content: "pick-up-bob",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "default",
    },
    {
      name: "format-detection",
      content: "telephone:no",
    },
    // Android
    {
      name: "mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "theme-color",
      content: "#D5EAFA",
    },
  ],
};

export default config;
