import { configureStore } from "@reduxjs/toolkit";
import api from "../api";
// import gameReducer from "../reducers/game";
import usersSlice from "../slices/users/users";
// import { setupListeners } from "@reduxjs/toolkit/dist/query";
import slice from "../slices";
import usersReducer from "../reducers/user";

export const store = configureStore({
  reducer: {
    // game: gameReducer,
    usersSlice: usersSlice,
    auth: slice.users.auth,
    user: usersReducer,
    [api.base.reducerPath]: api.base.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.base.middleware),
});

// setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
