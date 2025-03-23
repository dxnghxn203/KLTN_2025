"use client";
import { useParams } from "next/navigation";
import CategoryCard from "@/components/Category/categoryCard";

export default function CategoryList({
  data,
}: {
  data: { mainCategory: string; sub_category: any };
}) {
  const params = useParams();
  const mainCategory =
    data.mainCategory ||
    (Array.isArray(params.mainCategory)
      ? params.mainCategory[0]
      : params.mainCategory);
  const sub_category = data.sub_category || [];
  console.log("duyenoi", sub_category);

  return (
    <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sub_category.length > 0 ? (
        sub_category.map((categoryData: any, index: any) => (
          <CategoryCard
            key={index}
            mainCategory={mainCategory}
            icon={
              "https://kltn2025.s3.ap-southeast-2.amazonaws.com/images_primary/1742463222"
            }
            subCategories={categoryData}
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
