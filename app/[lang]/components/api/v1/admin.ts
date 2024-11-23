import { retry } from "@reduxjs/toolkit/query/react";
import { base } from "@/redux/api/base";
import { User } from "types/interfaces";

export const adminApi = base.injectEndpoints({
  endpoints: (build) => ({
    diactivateUser: build.mutation<{ id: string; user: User }, Partial<User>>({
      query: ({ id }) => ({
        url: `/api/v1/admin/users/diactivate/${id}`,
        method: "POST",
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
          retry.fail({ fake: "error" });
        },
      },
    }),
    blockUser: build.mutation<{ id: string; user: User }, Partial<User>>({
      query: (user) => ({
        url: `/api/v1/admin/users/block`,
        method: "POST",
        body: user,
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
          retry.fail({ fake: "error" });
        },
      },
    }),
    activateUser: build.mutation<{ id: string; user: User }, Partial<User>>({
      query: ({ id }) => ({
        url: `/api/v1/admin/users/activate`,
        method: "POST",
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
          retry.fail({ fake: "error" });
        },
      },
    }),
    setRole: build.mutation<
      { id: string; user: User },
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `/api/v1/admin/users/role`,
        method: "PUT",
        body: { role, id },
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
          retry.fail({ fake: "error" });
        },
      },
    }),
    passwordReset: build.mutation<{ email: string }, { email: string }>({
      query: ({ email }) => ({
        url: `/api/v1/users/passwordreset/`,
        method: "PUT",
        body: { email },
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
          retry.fail({ fake: "error" });
        },
      },
    }),
    getUsers: build.query<{ users: User[] }, void>({
      query: () => ({
        url: `/api/v1/admin/users`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useDiactivateUserMutation,
  useBlockUserMutation,
  useSetRoleMutation,
  usePasswordResetMutation,
  useActivateUserMutation,
  useGetUsersQuery,
  endpoints: {
    diactivateUser,
    blockUser,
    setRole,
    passwordReset,
    activateUser,
    getUsers,
  },
} = adminApi;
