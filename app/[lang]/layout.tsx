import FirebaseConfig from "@/firebase/Config";
import { i18n, type Locale } from "i18n-config";
import { Providers } from "@/components/providers";
import "@/components/styles/globals.css";
import { Suspense } from "react";
import Head from "next/head";
import Script from "next/script";
import { ColorScript } from "@/components/ColorScript";
import Loading from "@/components/loading";
import { Box, Text } from "@chakra-ui/react";
import { Breakpoints } from "@/config/ui";
import Navbar from "./components/nav/nav";
import { get } from "http";
import { getDictionary } from "get-dictionary";
import { MobileNavHeight } from "@/config/styling";
import Top from "./components/top";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const title = metadata.title;
  const lang = params.lang.toString();
  const dictionary = await getDictionary(params.lang);

  return (
    <html lang={params.lang}>
      <ColorScript />
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <link rel="icon" href="/favicon.ico" />

        <title>{`${title} | ${lang} `}</title>
      </head>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Meddon&family=Mr+Dafoe&family=Ruthie&display=swap"
          rel="stylesheet"
        ></link>
        <Script
          src="http://www.geoplugin.net/javascript.gp"
          type="text/javascript"
          lang="JavaScript"
          strategy="beforeInteractive"
        ></Script>
        <Script src="http://www.google.com/jsapi"></Script>
        <Script
          src="http://www.geoplugin.net/javascript.gp"
          type="text/javascript"
          strategy="beforeInteractive"
        ></Script>
        <Script src="http://www.geoplugin.net/ajax_currency_converter.gp"></Script>
        <Script
          src="http://www.geoplugin.net/javascript.gp"
          type="text/javascript"
          strategy="beforeInteractive"
        ></Script>
      </Head>
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          maxWidth: "100vw",
          overflowX: "hidden",
          backgroundColor: "white",
        }}
      >
        <Providers>
          <FirebaseConfig>
            <Suspense fallback={<Loading />}>
              <Box
                maxW={Breakpoints.lg}
                margin="0 auto"
                padding="0 1rem"
                overflowX="hidden"
                width="100%"
                minHeight="100vh"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="center"
                marginTop={"55px"}
                backgroundColor="white"
                borderLeft="solid"
                borderRight="solid"
                borderColor="gray.400"
                borderLeftWidth="1px"
                borderRightWidth="1px"
              >
                <Navbar lang={params.lang} dictionary={dictionary} />
                <Top lang={params.lang} dictionary={dictionary}>
                  {children}
                </Top>
              </Box>
            </Suspense>
          </FirebaseConfig>
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Mecofe - The blog of the future",
  description:
    "Mecofe is a blog that talks about the future of technology and the world.",
  keywords:
    "technology, future, blog, news, world, science, innovation, artificial intelligence, machine learning, deep learning, data science, data analysis, data visualization, data engineering, data management, data storage, data processing, data mining, data warehousing, data modeling, data architecture, data governance, data quality, data security, data privacy, data ethics, data protection ",
  openGraph: {
    title: "Mecofe - The blog of the future",
    description:
      "Mecofe is a blog that talks about the future of technology and the world.",
    images: [
      {
        // url: "/photos/location-poster.jpeg",
        width: 800,
        height: 600,
        alt: "Mecofe - The blog of the future",
      },
    ],
    type: "website",
  },
};
