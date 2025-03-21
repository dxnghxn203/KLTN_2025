"use client";
import Link from "next/link";
import { useCategory } from "@/hooks/useCategory";

export default function MenuHeader() {
  const { allCategory } = useCategory();

  return (
    <nav className="bg-[#F0F5FF] h-[46px] text-[#002E99] py-2 flex justify-center items-center">
      <ul className="flex justify-center space-x-14 font-normal text-[14px]">
        {allCategory.map((category: any) => (
          <li
            key={category.main_category_slug}
            className="cursor-pointer hover:text-[#004AF7]"
          >
            <Link href={`/${category.main_category_slug}`} passHref>
              {category.main_category_name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
