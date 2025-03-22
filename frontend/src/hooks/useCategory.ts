import { fetchGetAllCategoryStart, fetchGetMainCategoryStart, fetchGetSubCategoryStart, selectAllCategory, selectMainCategory, selectSubCategory } from "@/store/category";
import { useDispatch, useSelector } from "react-redux";

export function useCategory() {
  const dispatch = useDispatch();
  const allCategory: any = useSelector(selectAllCategory);
  const mainCategory: any = useSelector(selectMainCategory);
  const subCategory: any = useSelector(selectSubCategory);
  // Hàm khởi động fetch dữ liệu cho tất cả danh mục
  const fetchAllCategory = () => {
    dispatch(fetchGetAllCategoryStart());
  };

  const fetchMainCategory = (slug: any) => {
    dispatch(fetchGetMainCategoryStart(slug));
  };

  const fetchSubCategory = (mainCategory: any, subCategory: any) => {
    dispatch(fetchGetSubCategoryStart({ mainCategory, subCategory }));
  };
  
  return {
    allCategory,
    fetchAllCategory,
    fetchMainCategory,
    mainCategory,
    fetchSubCategory,
    subCategory,
  };
}

// export function useMainCategory(slug: any) {
//   const dispatch = useDispatch();
//   const mainCategory: any = useSelector(selectMainCategory);

//   // Hàm khởi động fetch dữ liệu cho danh mục chính
//   const fetchMainCategory = (slug: any) => {
//     dispatch(fetchGetMainCategoryStart(slug));
//   };

//   return {
//     mainCategory,
//     fetchMainCategory, // Trả về hàm để gọi thủ công
//   };
// }
