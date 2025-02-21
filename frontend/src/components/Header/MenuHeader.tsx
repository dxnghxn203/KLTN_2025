"use client";

export default function MenuHeader() {
  return (
    <nav className="bg-[#F0F5FF] h-[46px] text-[#002E99] py-2 flex justify-center items-center">
      <ul className="flex justify-center space-x-14 font-normal text-[14px]">
        <li className="cursor-pointer hover:text-[#004AF7]">
          Thực phẩm chức năng
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">Thuốc</li>
        <li className="cursor-pointer hover:text-[#004AF7]">Dược mỹ phẩm</li>
        <li className="cursor-pointer hover:text-[#004AF7]">Thiết bị y tế</li>
        <li className="cursor-pointer hover:text-[#004AF7]">
          Chăm sóc cá nhân
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">Mẹ và bé</li>
        <li className="cursor-pointer hover:text-[#004AF7]">
          Sức khỏe sinh sản
        </li>
        <li className="cursor-pointer hover:text-[#004AF7]">Góc sống khỏe</li>
      </ul>
    </nav>
  );
}
