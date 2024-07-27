import { uiLanguage, messaging } from "../actions/configs";

import { createReducer } from "@reduxjs/toolkit";
import { initialState } from "./index";

const UiConfig = createReducer(initialState, (builder) => {
  builder.addCase(uiLanguage, (state, action) => {
    return {
      ...state,
      uiLanguage: action.payload,
    };
  });
});

export default UiConfig;
