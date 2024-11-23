import React from "react";

import { Locale } from "i18n-config";
import PageData from "./components/pagData";
import { getDictionary } from "get-dictionary";
import { Button, Box } from "@chakra-ui/react";

const Page = async ({
  params: { lang, device },
}: {
  params: {
    lang: Locale;
    device: string;
  };
}) => {
  const dictionary = await getDictionary(lang);
  return <PageData params={{ lang, dictionary, device }} />;
};

export default Page;
