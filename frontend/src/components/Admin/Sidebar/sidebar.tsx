import { FiPieChart, FiShoppingBag, FiServer } from "react-icons/fi";
import { BsBox } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Dispatch, SetStateAction, memo } from "react";
import logo from "@/images/MM.png";
import textlogo from "@/images/medicare2.png";
import { LuUsersRound } from "react-icons/lu";

interface SidebarProps {
  isOpen: boolean;
  activeItem: string;
  setActiveItem: Dispatch<SetStateAction<string>>;
}

// Danh sách menu cố định (không render lại)
const menuItems = [
  {
    id: "Analytical",
    icon: <FiPieChart />,
    label: "Analytical",
    path: "/dashboard",
  },
  { id: "User", icon: <LuUsersRound />, label: "User", path: "/user" },
  {
    id: "Order",
    icon: <FiShoppingBag />,
    label: "Order",
    path: "/order",
  },
  { id: "Product", icon: <BsBox />, label: "Product", path: "/product" },
];

const Sidebar = memo(({ isOpen, activeItem, setActiveItem }: SidebarProps) => {
  return (
    <aside
      className={clsx(
        "flex flex-col p-4  border-r border-gray-200 transition-all duration-500 bg-[#FAFBFB]",
        isOpen ? "w-[270px]" : "w-[80px]"
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

      {/* Menu Items */}
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
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              onClick={() => setActiveItem(item.id)}
            >
              <div
                className={clsx(
                  "flex px-2 py-3 rounded-lg transition-all duration-500 cursor-pointer",
                  isOpen
                    ? "justify-start items-center"
                    : "justify-center items-center",
                  activeItem === item.id
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
          ))}
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
