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
    ,
    googleLogin: build.mutation({
      query: (payload) => ({
        url: "/Auth/google-login",
        method: "POST",
        body: payload
      })
    })
  }),
  overrideExisting: false
});

export const {
  useLoginMutation,
  useGoogleLoginMutation
} = authApi;
