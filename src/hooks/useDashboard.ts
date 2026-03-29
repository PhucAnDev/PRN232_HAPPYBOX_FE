import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  clearDashboardError,
  fetchDashboardSnapshot,
} from "../store/slices/dashboardSlice";

const useDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const fetchSnapshot = useCallback(
    (startDate: string, endDate: string, recentLimit?: number) =>
      dispatch(
        fetchDashboardSnapshot({ startDate, endDate, recentLimit }),
      ).unwrap(),
    [dispatch],
  );
  const clearError = useCallback(
    () => dispatch(clearDashboardError()),
    [dispatch],
  );

  return {
    ...dashboard,
    fetchSnapshot,
    clearError,
  };
};

export default useDashboard;
