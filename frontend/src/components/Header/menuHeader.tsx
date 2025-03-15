"use client";
import Link from "next/link";

export default function MenuHeader() {
  return (
    <nav className="bg-[#F0F5FF] h-[46px] text-[#002E99] py-2 flex justify-center items-center">
      <ul className="flex justify-center space-x-14 font-normal text-[14px]">
        <li className="cursor-pointer hover:text-[#004AF7]">
          <Link href="/functional-product">Thực phẩm chức năng</Link>
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">
          <Link href="/medicine">Thuốc</Link>
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">
          <Link href="/cosmetics">Dược mỹ phẩm</Link>
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">
          <Link href="/medical-equipment">Thiết bị y tế</Link>
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">
          <Link href="/personal-care">Chăm sóc cá nhân</Link>
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">
          <Link href="/mom-and-baby">Mẹ và bé</Link>
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">
          <Link href="/reproductive-health">Sức khỏe sinh sản</Link>
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">
          <Link href="/goc-song-khoe">Góc sống khỏe</Link>
        </li>
      </ul>
    </nav>
  );
}
