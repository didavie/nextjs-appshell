import { retry } from "@reduxjs/toolkit/query/react";
import { base } from "@/redux/api/base";
import { User } from "types/interfaces";

export const userApi = base.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
      {
        token: string;
        user: User;
        customToken: {
          token: string | null;
          createdAt: string | null;
        };
      },
      any
    >({
      query: (credentials: any) => ({
        url: "/api/user",
        method: "POST",
        body: credentials,
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
          retry.fail({ fake: "error" });
        },
      },
    }),
    updateFCMToken: build.mutation<{ token: string; user: User }, any>({
      query: ({ id, body }: any) => ({
        url: `/users/update/fcm-token`,
        method: "PUT",
        body,
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
          retry.fail({ fake: "error" });
        },
      },
    }),
    signup: build.mutation<User, { data: User }>({
      query: ({ data }) => ({
        url: `/api/users/signup/`,
        method: "POST",
        body: data,
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on signup, and this breaks out of retrying. The next signup attempt will succeed.
          retry.fail({ fake: "error" });
        },
      },
    }),
    updateUser: build.mutation<
      User,
      { id: string; data: User; updateType: string }
    >({
      query: ({ id, data, updateType }) => ({
        url: `/api/users/update`,
        method: "PUT",
        body: {
          data,
          updateType,
        },
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on signup, and this breaks out of retrying. The next signup attempt will succeed.
          retry.fail({ fake: "error" });
        },
      },
    }),
    logout: build.mutation<{ token: string; user: User }, any>({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
    }),

    resendEmailVerification: build.mutation<
      { message: string; success: boolean },
      User
    >({
      query: (user) => ({
        url: `/api/users/resend/email-verification`,
        method: "POST",
        body: user,
      }),
    }),
    passwordResetLink: build.mutation<
      { message: string; success: boolean },
      User
    >({
      query: (body) => ({
        url: `/api/users/passwordreset`,
        method: "PUT",
        body,
      }),
    }),

    updateRole: build.mutation<{ message: string; success: boolean }, User>({
      query: (body) => ({
        url: `/api/admin/setrole`,
        method: "PUT",
        body,
      }),
    }),
    getLocations: build.query<any, void>({
      query: () => ({
        url: `/api/users/location`,
        method: "GET",
      }),
    }),
    addItemView: build.mutation<
      { message: string; success: boolean },
      { id: string; user: string }
    >({
      query: ({ id, user }) => ({
        url: `/api/item/add/view`,
        method: "POST",
        body: { id, user },
      }),
    }),
    addItemLike: build.mutation<
      { message: string; success: boolean },
      { id: string; user: string }
    >({
      query: ({ id, user }) => ({
        url: `/api/item/add/like`,
        method: "POST",
        body: { id, user },
      }),
    }),
    removeItemLike: build.mutation<
      { message: string; success: boolean },
      { id: string; user: string }
    >({
      query: ({ id, user }) => ({
        url: `/api/item/remove/like`,
        method: "POST",
        body: { id, user },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  endpoints: {
    login,
    signup,
    logout,
    updateUser,
    resendEmailVerification,
    passwordResetLink,
    updateRole,
    updateFCMToken,
  },
  reducerPath,
} = userApi;
