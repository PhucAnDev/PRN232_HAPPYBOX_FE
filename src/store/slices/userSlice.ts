import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService, { UserResponse } from "../../services/userService";
import { getErrorMessage } from "../../utils/errorMessage";

interface UserState {
  users: UserResponse[];
  userDetailsById: Record<string, UserResponse>;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  userDetailsById: {},
  loading: false,
  error: null,
};

const normalizeUserList = (payload: unknown): UserResponse[] => {
  if (Array.isArray(payload)) {
    return payload as UserResponse[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: UserResponse[] }).data;
  }

  return [];
};

const normalizeUserDetail = (payload: unknown): UserResponse | null => {
  if (payload && typeof payload === "object") {
    if ("id" in (payload as Record<string, unknown>)) {
      return payload as UserResponse;
    }

    const nestedData = (payload as { data?: unknown }).data;
    if (
      nestedData &&
      typeof nestedData === "object" &&
      "id" in (nestedData as Record<string, unknown>)
    ) {
      return nestedData as UserResponse;
    }
  }

  return null;
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAll();
      return normalizeUserList(response.data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai danh sach nguoi dung"),
      );
    }
  },
);

export const fetchUserDetail = createAsyncThunk(
  "users/fetchUserDetail",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getById(userId);
      const user = normalizeUserDetail(response.data);

      if (!user) {
        throw new Error("Du lieu chi tiet nguoi dung khong hop le");
      }

      return user;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai chi tiet nguoi dung"),
      );
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        action.payload.forEach((user) => {
          state.userDetailsById[user.id] = user;
        });
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.userDetailsById[action.payload.id] = action.payload;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index >= 0) {
          state.users[index] = action.payload;
        }
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;
