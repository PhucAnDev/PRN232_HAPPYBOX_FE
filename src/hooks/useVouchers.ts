import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  clearVoucherError,
  createVoucherEntity,
  deleteVoucherEntity,
  fetchVouchers,
  updateVoucherEntity,
} from "../store/slices/voucherSlice";

const useVouchers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const vouchers = useSelector((state: RootState) => state.vouchers);

  return {
    ...vouchers,
    fetchVouchers: () => dispatch(fetchVouchers()).unwrap(),
    createVoucher: (payload: Parameters<typeof createVoucherEntity>[0]) =>
      dispatch(createVoucherEntity(payload)).unwrap(),
    updateVoucher: (
      id: string,
      data: Parameters<typeof updateVoucherEntity>[0]["data"],
    ) => dispatch(updateVoucherEntity({ id, data })).unwrap(),
    deleteVoucher: (voucherId: string) =>
      dispatch(deleteVoucherEntity(voucherId)).unwrap(),
    clearError: () => dispatch(clearVoucherError()),
  };
};

export default useVouchers;
