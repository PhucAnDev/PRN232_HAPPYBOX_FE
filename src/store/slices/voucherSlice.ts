import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import voucherService, {
  CreateVoucherRequest,
  UpdateVoucherRequest,
  VoucherResponse,
} from "../../services/voucherService";
import { getErrorMessage } from "../../utils/errorMessage";

interface VoucherState {
  vouchers: VoucherResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: VoucherState = {
  vouchers: [],
  loading: false,
  error: null,
};

export const fetchVouchers = createAsyncThunk(
  "vouchers/fetchVouchers",
  async (_, { rejectWithValue }) => {
    try {
      return await voucherService.getAllVouchers();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai danh sach voucher"),
      );
    }
  },
);

export const createVoucherEntity = createAsyncThunk(
  "vouchers/createVoucherEntity",
  async (payload: CreateVoucherRequest, { rejectWithValue }) => {
    try {
      return await voucherService.createVoucher(payload);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tao voucher"),
      );
    }
  },
);

export const updateVoucherEntity = createAsyncThunk(
  "vouchers/updateVoucherEntity",
  async (
    payload: { id: string; data: UpdateVoucherRequest },
    { rejectWithValue },
  ) => {
    try {
      await voucherService.updateVoucher(payload.id, payload.data);
      return await voucherService.getVoucherById(payload.id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the cap nhat voucher"),
      );
    }
  },
);

export const deleteVoucherEntity = createAsyncThunk(
  "vouchers/deleteVoucherEntity",
  async (voucherId: string, { rejectWithValue }) => {
    try {
      await voucherService.deleteVoucher(voucherId);
      return voucherId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the xoa voucher"),
      );
    }
  },
);

const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    clearVoucherError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createVoucherEntity.fulfilled, (state, action) => {
        state.vouchers.unshift(action.payload);
      })
      .addCase(updateVoucherEntity.fulfilled, (state, action) => {
        const index = state.vouchers.findIndex(
          (voucher) => voucher.id === action.payload.id,
        );
        if (index >= 0) {
          state.vouchers[index] = action.payload;
        }
      })
      .addCase(deleteVoucherEntity.fulfilled, (state, action) => {
        state.vouchers = state.vouchers.filter(
          (voucher) => voucher.id !== action.payload,
        );
      });
  },
});

export const { clearVoucherError } = voucherSlice.actions;

export default voucherSlice.reducer;
