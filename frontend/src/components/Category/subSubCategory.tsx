"use client";
import { useParams } from "next/navigation";
import { categoryProducts } from "@/components/Category/categoryData";
import Image from "next/image";

export default function SubSubCategory({
  child_category,
}: {
  child_category: any;
}) {
  return (
    <div>
      {child_category.child_category.length > 0 ? (
        <div className="flex justify-start gap-6 flex-wrap px-5">
          {child_category.child_category.map(
            (subSubCategory: any, index: any) => (
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
                  {subSubCategory.child_category_name}
                </span>
              </div>
            )
          )}
        </div>
      ) : (
        <p>Không có danh mục con nào.</p>
      )}
    </div>
  );
}
