import { fetchGetAllCategoryStart, fetchGetChildCategoryStart, fetchGetMainCategoryStart, fetchGetSubCategoryStart, selectAllCategory, selectChildCategory, selectMainCategory, selectSubCategory } from "@/store/category";
import { useDispatch, useSelector } from "react-redux";

export function useCategory() {
  const dispatch = useDispatch();
  const allCategory: any = useSelector(selectAllCategory);
  const mainCategory: any = useSelector(selectMainCategory);
  const subCategory: any = useSelector(selectSubCategory);
  const childCategory: any = useSelector(selectChildCategory);
  // Hàm khởi động fetch dữ liệu cho tất cả danh mục
  const fetchAllCategory = () => {
    dispatch(fetchGetAllCategoryStart());
  };

  const fetchMainCategory = (mainCategory: any) => {
    dispatch(fetchGetMainCategoryStart(mainCategory));
  };

  const fetchSubCategory = (mainCategory: any, subCategory: any) => {
    dispatch(fetchGetSubCategoryStart({ mainCategory, subCategory }));
  };
  const fetchChildCategory = (mainCategory: any, subCategory: any, childCategory:any) => {
    dispatch(fetchGetChildCategoryStart({ mainCategory, subCategory, childCategory }));
  }
  
  return {
    allCategory,
    fetchAllCategory,

    fetchMainCategory,
    mainCategory,

    fetchSubCategory,
    subCategory,
    
    fetchChildCategory,
    childCategory
    
  };
}

