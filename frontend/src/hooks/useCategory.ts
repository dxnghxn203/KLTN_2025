import { fetchGetAllCategoryForAdminStart, fetchGetAllCategoryStart, fetchGetChildCategoryStart, fetchGetMainCategoryStart, fetchGetProductByMainSlugStart, fetchGetSubCategoryStart, selectAllCategory, selectCategoryAdmin, selectChildCategory, selectMainCategory, selectProductByMainSlug, selectSubCategory } from "@/store/category";
import { useDispatch, useSelector } from "react-redux";

export function useCategory() {
  const dispatch = useDispatch();
  const allCategory: any = useSelector(selectAllCategory);
  const mainCategory: any = useSelector(selectMainCategory);
  const subCategory: any = useSelector(selectSubCategory);
  const childCategory: any = useSelector(selectChildCategory);
  const categoryAdmin: any = useSelector(selectCategoryAdmin);
  
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

  const fetchGetAllCategoryForAdmin = () => {
    dispatch(fetchGetAllCategoryForAdminStart());
  };
  return {
    allCategory,
    fetchAllCategory,

    fetchMainCategory,
    mainCategory,

    fetchSubCategory,
    subCategory,
    
    fetchChildCategory,
    childCategory,

    categoryAdmin,
    fetchGetAllCategoryForAdmin
    
  };
}

