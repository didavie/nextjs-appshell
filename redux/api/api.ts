import { base } from "./base";

export const Api = base.injectEndpoints({
  endpoints: (build) => ({}),

  overrideExisting: true,
});

export const {
  endpoints: {},
  reducerPath,
} = Api;
