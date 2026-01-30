import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { accessToken, refreshToken, user } = action.payload || {};
      state.accessToken = accessToken ?? state.accessToken;
      state.refreshToken = refreshToken ?? state.refreshToken;
      state.user = user ?? state.user;
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    }
  }
});

export const {
  setCredentials,
  clearCredentials
} = authSlice.actions;

export default authSlice.reducer;
