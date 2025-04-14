import { FiPieChart, FiShoppingBag } from "react-icons/fi";
import { BsBox } from "react-icons/bs";
import { TbCategory } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { memo } from "react";
import { usePathname } from "next/navigation";

import logo from "@/images/MM.png";
import textlogo from "@/images/medicare2.png";

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  {
    id: "Dashboard",
    icon: <FiPieChart />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    id: "User",
    icon: <FaRegUser />,
    label: "Người dùng",
    path: "/quan-ly-nguoi-dung",
  },
  {
    id: "Order",
    icon: <FiShoppingBag />,
    label: "Đơn hàng",
    path: "/quan-ly-don-hang",
  },
  {
    id: "Product",
    icon: <BsBox />,
    label: "Sản phẩm",
    path: "/san-pham",
  },
  {
    id: "Category",
    icon: <TbCategory />,
    label: "Danh mục",
    path: "/quan-ly-danh-muc",
  },
];

const Sidebar = memo(({ isOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "flex flex-col p-4 border-r border-gray-200 transition-all duration-500 bg-[#FAFBFB]",
        isOpen ? "w-[250px]" : "w-[80px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <Image src={logo} alt="Logo" width={50} height={50} priority />
        <Image
          src={textlogo}
          width={90}
          height={90}
          alt="Text Logo"
          priority
          className={clsx(
            "transition-opacity duration-1000",
            isOpen ? "opacity-100" : "opacity-0 hidden"
          )}
        />
      </div>

      {/* Menu */}
      <div className="px-2 flex flex-col w-full">
        <p
          className={clsx(
            "text-xs font-bold text-black mb-2",
            isOpen ? "opacity-100" : "opacity-100 text-center"
          )}
        >
          {isOpen ? "HOME" : "..."}
        </p>

        <nav className="space-y-1 w-full flex flex-col">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.id} href={item.path}>
                <div
                  className={clsx(
                    "flex px-2 py-3 rounded-lg transition-all duration-500 cursor-pointer",
                    isOpen
                      ? "justify-start items-center"
                      : "justify-center items-center",
                    isActive
                      ? "bg-[#1E4DB7] text-white"
                      : "text-black hover:bg-[#E7ECF7] hover:text-[#1E4DB7]"
                  )}
                >
                  <div className="text-lg">{item.icon}</div>
                  <span
                    className={clsx(
                      "ml-3",
                      isOpen ? "opacity-100" : "opacity-0 hidden"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <p
          className={clsx(
            "text-xs font-bold text-black my-2",
            isOpen ? "opacity-100" : "opacity-100 text-center"
          )}
        >
          {isOpen ? "SETTINGS" : "..."}
        </p>
      </div>
    </aside>
  );
});

export default Sidebar;
