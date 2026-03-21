import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import addressService, {
  VNDistrict,
  VNProvince,
  VNWard,
} from "../../services/addressService";
import { getErrorMessage } from "../../utils/errorMessage";

interface AddressState {
  provinces: VNProvince[];
  districtsByProvinceCode: Record<number, VNDistrict[]>;
  wardsByDistrictCode: Record<number, VNWard[]>;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  provinces: [],
  districtsByProvinceCode: {},
  wardsByDistrictCode: {},
  loading: false,
  error: null,
};

export const fetchProvinces = createAsyncThunk(
  "address/fetchProvinces",
  async (_, { rejectWithValue }) => {
    try {
      return await addressService.getProvinces();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai tinh/thanh pho"),
      );
    }
  },
);

export const fetchDistricts = createAsyncThunk(
  "address/fetchDistricts",
  async (provinceCode: number, { rejectWithValue }) => {
    try {
      return {
        provinceCode,
        districts: await addressService.getDistricts(provinceCode),
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai quan/huyen"),
      );
    }
  },
);

export const fetchWards = createAsyncThunk(
  "address/fetchWards",
  async (districtCode: number, { rejectWithValue }) => {
    try {
      return {
        districtCode,
        wards: await addressService.getWards(districtCode),
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai phuong/xa"),
      );
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districtsByProvinceCode[action.payload.provinceCode] =
          action.payload.districts;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.loading = false;
        state.wardsByDistrictCode[action.payload.districtCode] =
          action.payload.wards;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAddressError } = addressSlice.actions;

export default addressSlice.reducer;
