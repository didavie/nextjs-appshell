import { createAction } from "@reduxjs/toolkit";

import { configurationAction } from "../constants/types";

export const uiLanguage = createAction<string>(configurationAction.uiLanguage);


