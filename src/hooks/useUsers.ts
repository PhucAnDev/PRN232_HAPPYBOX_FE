import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  clearUserError,
  fetchUserDetail,
  fetchUsers,
} from "../store/slices/userSlice";

const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users);

  return {
    ...users,
    fetchUsers: () => dispatch(fetchUsers()).unwrap(),
    fetchUserDetail: (userId: string) =>
      dispatch(fetchUserDetail(userId)).unwrap(),
    clearError: () => dispatch(clearUserError()),
  };
};

export default useUsers;
