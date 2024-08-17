import { createAction } from "@reduxjs/toolkit";
import { IdTokenResult } from "firebase/auth";
import { uiAction } from "@/redux/constants/types";

export const setPostFilter = createAction<string>(uiAction.viewPostsFilter);
