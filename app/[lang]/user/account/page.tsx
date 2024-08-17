import React from "react";

import { Locale } from "i18n-config";
import PageData from "./components/pageData";
import { getDictionary } from "get-dictionary";

const page = async ({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) => {
  const dictionary = await getDictionary(lang);
  return <PageData params={{ lang, dictionary }} />;
};

export default page;
