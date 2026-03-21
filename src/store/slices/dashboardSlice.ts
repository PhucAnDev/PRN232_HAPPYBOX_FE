import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardService, {
  DashboardSummaryResponse,
  OrderStatusChartDto,
  RecentOrderDto,
  SalesTrendDto,
} from "../../services/dashboardService";
import { getErrorMessage } from "../../utils/errorMessage";

interface DashboardState {
  summary: DashboardSummaryResponse | null;
  salesTrend: SalesTrendDto[];
  orderStatus: OrderStatusChartDto[];
  recentOrders: RecentOrderDto[];
  loading: boolean;
  error: string | null;
  range: {
    startDate: string | null;
    endDate: string | null;
  };
}

const initialState: DashboardState = {
  summary: null,
  salesTrend: [],
  orderStatus: [],
  recentOrders: [],
  loading: false,
  error: null,
  range: {
    startDate: null,
    endDate: null,
  },
};

export const fetchDashboardSnapshot = createAsyncThunk(
  "dashboard/fetchDashboardSnapshot",
  async (
    payload: { startDate: string; endDate: string; recentLimit?: number },
    { rejectWithValue },
  ) => {
    try {
      const [summaryResponse, trendResponse, orderStatusResponse, recentResponse] =
        await Promise.all([
          dashboardService.getSummary(payload.startDate, payload.endDate),
          dashboardService.getSalesTrend(payload.startDate, payload.endDate),
          dashboardService.getOrderStatus(payload.startDate, payload.endDate),
          dashboardService.getRecentOrders(payload.recentLimit ?? 5),
        ]);

      return {
        startDate: payload.startDate,
        endDate: payload.endDate,
        summary: summaryResponse.data.data,
        salesTrend: trendResponse.data.data,
        orderStatus: orderStatusResponse.data.data,
        recentOrders: recentResponse.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai du lieu dashboard"),
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSnapshot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSnapshot.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.salesTrend = action.payload.salesTrend;
        state.orderStatus = action.payload.orderStatus;
        state.recentOrders = action.payload.recentOrders;
        state.range = {
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
        };
      })
      .addCase(fetchDashboardSnapshot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;
