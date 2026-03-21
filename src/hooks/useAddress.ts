import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  clearAddressError,
  fetchDistricts,
  fetchProvinces,
  fetchWards,
} from "../store/slices/addressSlice";

const useAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const address = useSelector((state: RootState) => state.address);

  return {
    ...address,
    fetchProvinces: () => dispatch(fetchProvinces()).unwrap(),
    fetchDistricts: (provinceCode: number) =>
      dispatch(fetchDistricts(provinceCode)).unwrap(),
    fetchWards: (districtCode: number) =>
      dispatch(fetchWards(districtCode)).unwrap(),
    clearError: () => dispatch(clearAddressError()),
  };
};

export default useAddress;
