import { createReducer } from "@reduxjs/toolkit";
import { initialState } from "../reducers/index";

const usersReducer = createReducer(initialState, (builder) => {});

export default usersReducer;
