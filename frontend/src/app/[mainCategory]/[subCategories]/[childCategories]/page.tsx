"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer/footer";
import ProductPortfolioList from "@/components/Product/productMainCategoryList";
import ProductsViewedList from "@/components/Product/productsViewedList";
import SubSubCategory from "@/components/Category/subSubCategory";
import { useCategory } from "@/hooks/useCategory";
import { useEffect } from "react";
import ProductChildCategoryList from "@/components/Product/productChildCategoryList ";

export default function CategoryPage() {
  const params = useParams();
  const { subCategory, fetchSubCategory } = useCategory();
  const { mainCategory } = useCategory();
  const { childCategory, fetchChildCategory } = useCategory();

  const mainCategories = Array.isArray(params.mainCategory)
    ? params.mainCategory[0]
    : params.mainCategory;

  const subCategories = Array.isArray(params.subCategories)
    ? params.subCategories[0]
    : params.subCategories;
  const childCategories = Array.isArray(params.childCategories)
    ? params.childCategories[0]
    : params.childCategories;

  const categoryTitle = mainCategory?.main_category_name || "Danh mục sản phẩm";

  useEffect(() => {
    fetchSubCategory(mainCategories, subCategories);
    fetchChildCategory(mainCategories, subCategories, childCategories);
  }, []);

  const subCategoriesTitle = subCategory?.sub_category_name || "Danh mục con";
  const childCategoryTitle = childCategory?.child_category_name;
  console.log("rr", childCategoryTitle);

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link
            href={`/${mainCategory?.main_category_slug}`}
            className="hover:underline text-blue-600"
          >
            {categoryTitle}
          </Link>
          <span> / </span>
          <Link
            href={`/${mainCategory?.main_category_slug}/${subCategory?.sub_category_slug}`}
            className="hover:underline text-blue-600"
          >
            {subCategoriesTitle}
          </Link>
          <span className="text-gray-500"> / </span>
          <span className="text-sm text-gray-500">{childCategoryTitle}</span>
        </div>
        <div className="text-2xl font-bold p-4">{childCategoryTitle}</div>
        <ProductChildCategoryList />
      </main>
      <div className="text-2xl font-extrabold text-black px-5 pt-10">
        Sản phẩm vừa xem
      </div>
      <div className="px-5">
        <ProductsViewedList />
      </div>
      <Footer />
    </div>
  );
}
