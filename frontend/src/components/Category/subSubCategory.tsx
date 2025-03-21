"use client";
import { useParams } from "next/navigation";
import { categoryProducts } from "@/components/Category/categoryData";
import Image from "next/image";

export default function SubSubCategory() {
  const params = useParams();
  const mainCategory = Array.isArray(params.mainCategory)
    ? params.mainCategory[0]
    : params.mainCategory;
  const subCategories = Array.isArray(params.subCategories)
    ? params.subCategories[0]
    : params.subCategories;

  const subCategoryData = categoryProducts[mainCategory]?.find(
    (item) => item.subCategories.link === subCategories
  );

  const subSubCategories =
    subCategoryData?.subCategories.subSubCategories || [];

  return (
    <div>
      {subSubCategories.length > 0 ? (
        <div className="flex justify-start gap-6 flex-wrap px-5">
          {subSubCategories.map((subSubCategory, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="rounded-full bg-[#EAEFFA] w-[130px] h-[130px] flex items-center justify-center">
                <Image
                  src={subSubCategory.img}
                  alt="icon"
                  width={120}
                  height={120}
                />
              </div>
              <span className="mt-2 w-[130px] text-center">
                {subSubCategory.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có danh mục con nào.</p>
      )}
    </div>
  );
}
