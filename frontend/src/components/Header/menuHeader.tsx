"use client";
import Link from "next/link";
import { useCategory } from "@/hooks/useCategory";

const categories = [
  { name: "Thực phẩm chức năng", slug: "thuc-pham-chuc-nang" },
  { name: "Thuốc", slug: "thuoc" },
  { name: "Dược mỹ phẩm", slug: "duoc-my-pham" },
  { name: "Thiết bị y tế", slug: "thiet-bi-y-te" },
  { name: "Chăm sóc cá nhân", slug: "cham-soc-ca-nhan" },
  { name: "Mẹ và bé", slug: "me-va-be" },
  { name: "Sức khỏe sinh sản", slug: "suc-khoe-sinh-san" },
  { name: "Góc sống khỏe", slug: "goc-song-khoe" },
];

// console.log(allCategory);

export default function MenuHeader() {
  const { allCategory } = useCategory();
  console.log(allCategory);
  return (
    <nav className="bg-[#F0F5FF] h-[46px] text-[#002E99] py-2 flex justify-center items-center">
      <ul className="flex justify-center space-x-14 font-normal text-[14px]">
        {categories.map((category) => (
          <li
            key={category.slug}
            className="cursor-pointer hover:text-[#004AF7]"
          >
            <Link href={`/${category.slug}`} passHref>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
