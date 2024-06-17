import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
let baseURL = "";

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: (headers, { getState }) => {
    // const token = (getState() as RootState).user.idTokenResult?.token;
    // const customToken = (getState() as RootState).user.idTokenResult?.token;
    // if (token) {
    //   headers.set("authorization", `Bearer ${token}`);
    // }
    // if (customToken) {
    //   headers.set("customToken", customToken);
    // }
    // if (userId) {
    //   headers.set("user", userId);
    // } else {
    //   // set an alphanumeric string to identify the user
    //   const user = Math.random().toString(36).substring(7);
    //   headers.set("user", user);
    // }
    // if (visited) {
    //   headers.set("visited", visited);
    // }
    // const realInfo = (getState() as RootState).user.userRealInfo;
    // if (realInfo) {
    //   headers.set("x-user-real-info", realInfo);
    // }
    headers.set("Content-Type", "application/json");

    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */
export const base = createApi({
  /**
   * `reducerPath` is optional and will not be required by most users.
   * This is useful if you have multiple API definitions,
   * e.g. where each has a different domain, with no interaction between endpoints.
   * Otherwise, a single API definition should be used in order to support tag invalidation,
   * among other features
   */
  reducerPath: "api",
  /**
   * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
   */
  baseQuery: baseQueryWithRetry,
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  refetchOnMountOrArgChange: 30,

  tagTypes: ["Transaction, User"],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   */

  //
  // Define any custom hooks that use the baseQuery and
  // need to be used outside of a React component
  //
  // e.g.:
  endpoints: () => ({
    // Define any endpoints here
  }),
});

export const enhancedApi = base.enhanceEndpoints({
  endpoints: () => ({
    getQuestion: () => "test",
  }),
});
