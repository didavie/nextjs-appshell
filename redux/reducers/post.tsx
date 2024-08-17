import { createReducer } from "@reduxjs/toolkit";
import { initialState } from "@/redux/reducers/index";
import { setPostFilter } from "../actions/post";

const postReducer = createReducer(initialState, (builder) => {
  builder.addCase(setPostFilter, (state, action) => {
    return {
      ...state,
      viewPostsFilter: action.payload,
    };
  });
});

export default postReducer;
