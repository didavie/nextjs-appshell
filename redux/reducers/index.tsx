import { IdTokenResult } from "firebase/auth";
import { SigninCheckResult } from "reactfire";
type State = {
  uiLanguage: string;
  viewPostsFilter: string;
  currentLanguage: string;
};

export const initialState: State = {
  uiLanguage: "fr",
  viewPostsFilter: "Latest",
  currentLanguage: "en",
};
