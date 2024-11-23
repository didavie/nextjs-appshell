import { createAction } from "@reduxjs/toolkit";
import { SigninCheckResult } from "reactfire";
import { IdTokenResult } from "firebase/auth";
import { userAction } from "../constants/types";

export const logout = createAction("");

export const setCurrentLanguage = createAction<string>(
  userAction.currentLanguage
);
