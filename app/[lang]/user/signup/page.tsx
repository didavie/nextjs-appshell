import React from "react";

import { Locale } from "i18n-config";
import { getDictionary } from "get-dictionary";
import PageData from "./components/pageData";

export default async function page({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dictionary = await getDictionary(lang);

  return <PageData params={{ lang, dictionary }} />;
}
