import { uiLanguage } from "../actions/ui";

import { createReducer } from "@reduxjs/toolkit";
import { initialState } from "./index";
import { setPostFilter } from "../actions/post";

const uiReducer = createReducer(initialState, (builder) => {
  builder.addCase(uiLanguage, (state, action) => {
    return {
      ...state,
      uiLanguage: action.payload,
    };
  });
  builder.addCase(setPostFilter, (state, action) => {
    return {
      ...state,
      viewPostsFilter: action.payload,
    };
  });
});

export default uiReducer;
