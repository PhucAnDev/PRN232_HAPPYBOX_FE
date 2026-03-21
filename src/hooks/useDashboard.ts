import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  clearDashboardError,
  fetchDashboardSnapshot,
} from "../store/slices/dashboardSlice";

const useDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboard = useSelector((state: RootState) => state.dashboard);

  return {
    ...dashboard,
    fetchSnapshot: (
      startDate: string,
      endDate: string,
      recentLimit?: number,
    ) =>
      dispatch(
        fetchDashboardSnapshot({ startDate, endDate, recentLimit }),
      ).unwrap(),
    clearError: () => dispatch(clearDashboardError()),
  };
};

export default useDashboard;
