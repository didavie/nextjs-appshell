import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../../types/interfaces";
import api from "../../api";
import { IdTokenResult } from "firebase/auth";
import { SigninCheckResult } from "reactfire";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: {} as User,
    loading: false,
    doSignup: false,
    customToken: null,
  } as {
    user: User;
    loading: boolean;
    doSignup: boolean;
    customToken: {
      token: string | null;
      createdAt: string | null;
    } | null;
  },
  reducers: {},
});

export default usersSlice.reducer;
