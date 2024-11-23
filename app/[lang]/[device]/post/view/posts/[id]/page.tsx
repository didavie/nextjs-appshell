import { Locale } from "i18n-config";

import { getDictionary } from "get-dictionary";
import PageData from "./components/pageData";

export default async function Page({
  params: { lang, device, id },
}: {
  params: { lang: Locale; device: string; id: string };
}) {
  const dictionary = await getDictionary(lang);

  return <PageData params={{ lang, dictionary, device, id }} />;
}
