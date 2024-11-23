import { i18n, type Locale } from "i18n-config";
import { Suspense, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import Loading from "app/[lang]/[device]/components/loading";
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function Root({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          // {device === "mobile" ? "100%" : "100%"}
        >
          {children}
        </Box>
      </Suspense>
    </>
  );
}
