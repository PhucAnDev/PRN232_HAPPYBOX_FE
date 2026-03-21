import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  clearMomoRedirect,
  clearOrderError,
  createMomoOrderEntity,
  createOrderEntity,
  fetchAllOrders,
  fetchMomoPaymentStatus,
  fetchOrderDetail,
  fetchUserOrders,
  updateOrderStatusEntity,
} from "../store/slices/orderSlice";

const useOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders);

  return {
    ...orders,
    fetchOrders: () => dispatch(fetchAllOrders()).unwrap(),
    fetchUserOrders: (userId: string) =>
      dispatch(fetchUserOrders(userId)).unwrap(),
    fetchOrderDetail: (orderId: string) =>
      dispatch(fetchOrderDetail(orderId)).unwrap(),
    createOrder: (payload: Parameters<typeof createOrderEntity>[0]) =>
      dispatch(createOrderEntity(payload)).unwrap(),
    updateOrderStatus: (
      id: string,
      status: Parameters<typeof updateOrderStatusEntity>[0]["status"],
    ) => dispatch(updateOrderStatusEntity({ id, status })).unwrap(),
    createMomoOrder: (payload: Parameters<typeof createMomoOrderEntity>[0]) =>
      dispatch(createMomoOrderEntity(payload)).unwrap(),
    fetchMomoPaymentStatus: (orderId: string) =>
      dispatch(fetchMomoPaymentStatus(orderId)).unwrap(),
    clearError: () => dispatch(clearOrderError()),
    clearMomoRedirect: () => dispatch(clearMomoRedirect()),
  };
};

export default useOrders;
