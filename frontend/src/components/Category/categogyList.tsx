"use client";
import { useParams } from "next/navigation";
import CategoryCard from "@/components/Category/CategoryCard";
import { categoryProducts } from "@/components/Category/categoryData";
import { useCategory, useMainCategory } from "@/hooks/useCategory";

export default function CategoryList() {
  const params = useParams();

  // const { mainCategory } = useMainCategory();
  const mainCategory = Array.isArray(params.mainCategory)
    ? params.mainCategory[0]
    : params.mainCategory;

  // Lấy danh sách sản phẩm từ category
  const productList = categoryProducts[mainCategory] || [];

  return (
    <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {productList.length > 0 ? (
        productList.map((categoryData, index) => (
          <CategoryCard
            key={index}
            mainCategory={mainCategory}
            icon={categoryData.icon}
            subCategories={categoryData.subCategories}
          />
        ))
      ) : (
        <p className="text-center w-full text-gray-500">
          Không có sản phẩm nào.
        </p>
      )}
    </div>
  );
}
