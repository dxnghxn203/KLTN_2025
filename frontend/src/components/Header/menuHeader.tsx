"use client";
import Link from "next/link";
import { useCategory } from "@/hooks/useCategory";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHandHoldingHeart } from "react-icons/fa";
import { TbStarsFilled } from "react-icons/tb";

export default function MenuHeader() {
  const { allCategory, fetchAllCategory } = useCategory();
  const router = useRouter();

  useEffect(() => {
    fetchAllCategory();
  }, []);

  const action = (category: any) => {
    router.push(`/${category.main_category_slug}`);
  };

  // Tách 5 cái đầu và phần dư
  const visibleCategories = allCategory?.slice(0, 6) || [];
  const extraCategories = allCategory?.slice(6) || [];

  return (
    <nav className="bg-[#F0F5FF] text-[#002E99] py-3 flex justify-center items-center">
      <ul className="flex justify-center space-x-14 font-normal text-[14px]">
        {/* 5 category đầu tiên */}
        {visibleCategories.map((category: any) => (
          <li key={category.main_category_slug}>
            <button
              onClick={() => action(category)}
              className="flex items-center justify-between w-full text-[#002E99] rounded-sm md:w-auto hover:text-blue-600"
            >
              {category.main_category_name}
            </button>
          </li>
        ))}

        {/* Góc sức khỏe */}
        <li className="relative group">
          <div
            className="cursor-pointer hover:text-blue-500"
            onClick={() => router.push("/bai-viet")}
          >
            Góc sức khỏe
          </div>
          <div className="absolute left-0 top-full mt-0 bg-white border border-gray-200 shadow-lg rounded-lg hidden group-hover:block z-10 w-[180px]">
            <ul className="text-sm text-gray-700 py-2">
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                <FaHandHoldingHeart className="w-4 h-4 text-blue-700" />
                <Link
                  href="/goc-suc-khoe/bai-viet-y-te"
                  className="hover:underline"
                >
                  Bài viết y tế
                </Link>
              </li>
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                <TbStarsFilled className="w-4 h-4 text-blue-700" />
                <Link
                  href="/goc-suc-khoe/truyen-thong"
                  className="hover:underline"
                >
                  Truyền thông
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Khác - hiển thị phần dư */}
        <li className="relative group">
          <div className="cursor-pointer hover:text-blue-500">Khác</div>
          {extraCategories.length > 0 && (
            <div className="absolute left-0 top-full mt-0 bg-white border border-gray-200 shadow-lg rounded-lg hidden group-hover:block z-10 w-[200px]">
              <ul className="text-sm text-gray-700 py-2">
                {extraCategories.map((category: any) => (
                  <li
                    key={category.main_category_slug}
                    onClick={() => action(category)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {category.main_category_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
