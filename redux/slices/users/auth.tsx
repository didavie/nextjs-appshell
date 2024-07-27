import { createSlice } from "@reduxjs/toolkit";
import api from "../../api";
import { User } from "../../../types/interfaces";
import type { RootState } from "../../store/store";
import { SigninCheckResult } from "reactfire";
import { IdTokenResult } from "firebase/auth";

const initialState = {
  user: {},
  token: "",
  isAuthenticated: false,
  customToken: null,
} as {
  user: null | User;
  token: string | null;
  isAuthenticated: boolean | null;
  customToken: {
    token: string | null;
    createdAt: string | null;
  } | null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.user.endpoints.login.matchPending, (state) => {})
      .addMatcher(
        api.user.endpoints.login.matchFulfilled,
        (state, action) => {}
      )
      .addMatcher(api.user.endpoints.login.matchRejected, (state) => {});
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
