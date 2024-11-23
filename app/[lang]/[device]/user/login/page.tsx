import React from "react";

import { Locale } from "i18n-config";
import LoginData from "./components/pageData";
import { getDictionary } from "get-dictionary";

const Login = async ({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) => {
  const dictionary = await getDictionary(lang);
  return <LoginData params={{ lang, dictionary }} />;
};

export default Login;
