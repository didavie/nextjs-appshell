"use client";
import { i18n, type Locale } from "i18n-config";
import AhiLoading from "@/components/loading";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const Loading = () => {
  return <AhiLoading></AhiLoading>;
};
export default Loading;
