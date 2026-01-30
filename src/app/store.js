import { configureStore } from "@reduxjs/toolkit";
import { rootApi } from "../services/rootApi";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [rootApi.reducerPath]: rootApi.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware)
});

export default store;
