"use client";
import Link from "next/link";
import { useCategory } from "@/hooks/useCategory";
import { useEffect, useState } from "react";
import MenuFullDropdown from "./menuFullDropdown";
import { useRouter } from "next/navigation";

export default function MenuHeader() {
  const { allCategory, fetchAllCategory } = useCategory();

  useEffect(() => {
    fetchAllCategory();
  }, []);
  const router = useRouter();

  const action = (category: any) => {
    console.log(category)
    router.push(`/${category.main_category_slug}`);
  }

  console.log(allCategory);
  return (
    <>
      <nav className="bg-[#F0F5FF] text-[#002E99] py-2 flex justify-center items-center relative">
        <ul className="flex justify-center space-x-14 font-normal text-[14px]">
          {allCategory && allCategory.length > 0 ? (
            <>
              {allCategory.map((category: any) => (
                <li key={category.main_category_slug} className="menu-container group menu-item-with-dropdown">
                  <button
                    id="mega-menu-full-dropdown-button"
                    onClick={() => action(category)}
                    data-collapse-toggle="mega-menu-full-dropdown"
                    className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm md:w-auto hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700">
                    {category.main_category_name}
                  </button>
                  <div key={category.main_category_slug} className="mega-menu-full-dropdown w-full absolute left-0 top-full mt-1 z-50 hidden group-hover:block animate-fadeIn">
                    <div className="bg-white backdrop-blur-sm p-6 rounded-lg shadow-lg w-full">
                      <MenuFullDropdown mainCategoryData={category.main_category_slug}  />
                    </div>
                  </div>
                </li>
              ))}
              {/* Thêm mục "Góc sức khỏe" */}
              <li className="cursor-pointer hover:text-[#004AF7]">
                <Link href="/goc-suc-khoe" passHref>
                  Góc sức khỏe
                </Link>
              </li>
              {/* Thêm mục "Khác" */}
              <li className="cursor-pointer hover:text-[#004AF7]">
                <Link href="/khac" passHref>
                  Khác
                </Link>
              </li>
            </>
          ) : (
            <li>Không có danh mục nào</li>
          )}
        </ul>
      </nav>
    </>
  );
}
