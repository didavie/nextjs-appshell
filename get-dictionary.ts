import "server-only";
import type { Locale } from "./i18n-config";
import FrDictionary from "dictionaries/fr";
import tDictionary from "dictionaries/t";

const getDictionaries = async () => {

  const tD= Object.keys(tDictionary).reduce((acc, key) => {
    const value = tDictionary[key as keyof typeof tDictionary];
    Object.keys(value).forEach((locale) => {
      if (!acc[locale as Locale]) {
        acc[locale as Locale] = {} as Record<keyof typeof tDictionary, string>;
      }
      acc[locale as Locale][key as keyof typeof tDictionary] = value[locale as Locale];
    });
    return acc;
  }, {} as Record<Locale, Record<keyof typeof tDictionary, string>>);

  return { tDictionary: tD};
};

const dictionaries = {
  en: async () => {
    const t = await getDictionaries();
    return (
      t?.tDictionary?.en ||
      (FrDictionary as Record<keyof typeof tDictionary, string>)
    );
  },
  fr: async () => {
    const t = await getDictionaries();
    return (
      t?.tDictionary?.fr ||
      (FrDictionary as Record<keyof typeof tDictionary, string>)
    );
  },
  es: async () => {
    const t = await getDictionaries();
    return (
      t?.tDictionary?.es ||
      (FrDictionary as Record<keyof typeof tDictionary, string>)
    );
  },
  de: async () => {
    const t = await getDictionaries();
    return (
      t?.tDictionary?.de ||
      (FrDictionary as Record<keyof typeof tDictionary, string>)
    );
  },
  ar: async () => {
    const t = await getDictionaries();
    return (
      t?.tDictionary?.ar ||
      (FrDictionary as Record<keyof typeof tDictionary, string>)
    );
  },
  pt: async () => {
    const t = await getDictionaries();
    return (
      t?.tDictionary?.pt ||
      (FrDictionary as Record<keyof typeof tDictionary, string>)
    );
  },
  ru: async () => {
    const t = await getDictionaries();
    return (
      t?.tDictionary?.ru ||
      (FrDictionary as Record<keyof typeof tDictionary, string>)
    );
  },
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() || dictionaries.en();

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;
//  get the type without promise
export type Dictionary = AsyncReturnType<typeof getDictionary>;

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
// const dictionaries = {
//   en: () => import("./dictionaries/en.json").then((module) => module.default),
//   fr: () => import("./dictionaries/fr.json").then((module) => module.default),
//   es: () => import("./dictionaries/es.json").then((module) => module.default),
//   de: () => import("./dictionaries/de.json").then((module) => module.default),
//   ar: () => import("./dictionaries/ar.json").then((module) => module.default),
//   pt: () => import("./dictionaries/pt.json").then((module) => module.default),
//   ru: () => import("./dictionaries/ru.json").then((module) => module.default),
// };

// export const getDictionary = async (locale: Locale) =>
//   dictionaries[locale]?.() || dictionaries.en();

// type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
//   ...args: any
// ) => Promise<infer R>
//   ? R
//   : any;
// //  get the type without promise
// export type Dictionary = AsyncReturnType<typeof getDictionary>;
