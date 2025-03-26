import { fetchInsertUserStart, fetchVerifyOtpStart } from "@/store";
import { fetchGetAllCategoryStart, fetchGetChildCategoryStart, fetchGetMainCategoryStart, fetchGetSubCategoryStart, selectAllCategory, selectChildCategory, selectMainCategory, selectSubCategory } from "@/store/category";
import { insertUserSelector } from "@/store/user/userSelector";
import { useDispatch, useSelector } from "react-redux";

export function useUser() {
  const dispatch = useDispatch();
  const insertUser: any = useSelector(insertUserSelector);
  // Hàm khởi động fetch dữ liệu cho tất cả danh mục
  const fetchInsertUser = ({
    param, onSuccess, onFailure
  }: {
    param: any;
    onSuccess: (message: string) => void;
    onFailure: (message: string) => void;
  }) => {
    dispatch(fetchInsertUserStart({
      ...param,
      onSuccess,
      onFailure
    }));
  };

  const verifyOtp = ({
    param, onSuccess, onFailure
  }: {
    param: any;
    onSuccess: (message: string) => void;
    onFailure: (message: string) => void;
  }) => {
    dispatch(fetchVerifyOtpStart({
      ...param,
      onSuccess,
      onFailure
    }));
  };

  return {
    insertUser,
    fetchInsertUser,
    verifyOtp
  };
}

