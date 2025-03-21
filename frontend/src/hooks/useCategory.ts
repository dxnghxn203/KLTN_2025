import { fetchGetAllCategoryStart, fetchGetMainCategoryStart, selectAllCategory, selectMainCategory } from "@/store/category";
import { useDispatch, useSelector } from "react-redux";

export function useCategory() {
  const dispatch = useDispatch();
  const allCategory: any = useSelector(selectAllCategory);

  // Hàm khởi động fetch dữ liệu cho tất cả danh mục
  const fetchAllCategory = () => {
    dispatch(fetchGetAllCategoryStart());
  };

  return {
    allCategory,
    fetchAllCategory, // Trả về hàm để gọi thủ công
  };
}

export function useMainCategory(slug: any) {
  const dispatch = useDispatch();
  const mainCategory: any = useSelector(selectMainCategory);

  // Hàm khởi động fetch dữ liệu cho danh mục chính
  const fetchMainCategory = (slug: any) => {
    dispatch(fetchGetMainCategoryStart(slug));
  };

  return {
    mainCategory,
    fetchMainCategory, // Trả về hàm để gọi thủ công
  };
}
