import { rootApi } from "../../services/rootApi";

export const authApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: "/Auth/login",
        method: "POST",
        body: credentials
      })
    })
  }),
  overrideExisting: false
});

export const {
  useLoginMutation
} = authApi;
