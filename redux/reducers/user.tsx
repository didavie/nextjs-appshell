import { createReducer } from "@reduxjs/toolkit";
import { initialState } from "../reducers/index";
import { setCurrentLanguage } from "../actions/users";

const usersReducer = createReducer(initialState, (builder) => {
  builder.addCase(setCurrentLanguage, (state, action) => {
    return {
      ...state,
      currentLanguage: action.payload,
    };
  });
});

export default usersReducer;
