import { BsBox, BsBarChart } from "react-icons/bs";
import { LuUsers, LuRefreshCcw } from "react-icons/lu";
import { RiMore2Fill } from "react-icons/ri";
import CustomPagination from "@/components/Admin/CustomPagination/customPagination";
import { useState, useEffect } from "react";
import FilterBar from "./filterBar";
import Link from "next/link";
import { IoMdArrowUp } from "react-icons/io";
import AddNewDropdown from "./addNewDropdown";
import { BiEditAlt } from "react-icons/bi";
import { ImBin } from "react-icons/im";
import { IoFilter } from "react-icons/io5";

const products = [
  {
    id: "P001",
    name: "Găng tay dùng một lần Salon World Safety Blue Nitrile. World Safety Blue Nitrile. World Safety Blue Nitrile.",
    price: 10000,
    category: "Category 1",
    rate: "4.5",
    date: "2025-03-17",
    quantity: 20,
  },
  {
    id: "P002",
    name: "Product B",
    price: 30000,
    category: "Category 2",
    rate: "4.0",
    date: "2025-03-16",
    quantity: 0,
  },
  {
    id: "P003",
    name: "Product C",
    price: 30000,
    category: "Category 3",
    rate: "5.0",
    date: "2025-03-15",
    quantity: 0,
  },
  {
    id: "P004",
    name: "Product D",
    price: 30000,
    category: "Category 4",
    rate: "4.8",
    date: "2025-03-14",
    quantity: 25,
  },
  {
    id: "P005",
    name: "Product E",
    price: 30000,
    category: "Category 5",
    rate: "4.3",
    date: "2025-03-13",
    quantity: 20,
  },
  {
    id: "P006",
    name: "Product F",
    price: 30000,
    category: "Category 6",
    rate: "4.7",
    date: "2025-03-12",
    quantity: 3,
  },
  {
    id: "P007",
    name: "Product F",
    price: 30000,
    category: "Category 6",
    rate: "4.7",
    date: "2025-03-12",
    quantity: 3,
  },
  {
    id: "P008",
    name: "Product F",
    price: 30000,
    category: "Category 6",
    rate: "4.7",
    date: "2025-03-12",
    quantity: 3,
  },
];

const ManagerProducts = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 6;
  const [menuOpen, setMenuOpen] = useState<string | number | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const toggleMenu = (productId: string | number) => {
    setMenuOpen(menuOpen === productId ? null : productId);
  };

  // Giả sử products là danh sách sản phẩm thực tế
  const totalproducts = products; // Không lấy length mà lấy toàn bộ mảng

  // Lọc các sản phẩm cho trang hiện tại
  const currentproducts = totalproducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-black">Product Management</h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Home
        </Link>
        <span> / </span>
        <Link href="/product/product-management" className="text-gray-800">
          Product management
        </Link>
      </div>

      <div className="flex space-x-4">
        <div className="bg-white rounded-3xl flex w-full items-center justify-between shadow-sm">
          <div className="flex-1 py-6 flex flex-col items-center space-y-3">
            <div className="bg-[#EFF9FF] rounded-full h-16 w-16 flex justify-center items-center">
              <LuUsers className="text-[#1A97F5] text-3xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-2xl">39,354</span>
              <span className="text-sm text-[#9297A0]">Customers</span>
            </div>
          </div>

          <div className="w-[0.5px] h-full bg-gray-200"></div>

          <div className="flex-1 py-6 flex flex-col items-center space-y-3">
            <div className="bg-[#FFF4E5] rounded-full h-16 w-16 flex justify-center items-center">
              <BsBox className="text-[#FDC90F] text-3xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-2xl">4,396</span>
              <span className="text-sm text-[#9297A0]">Products</span>
            </div>
          </div>

          <div className="w-[0.5px] h-full bg-gray-200"></div>

          <div className="flex-1 py-6 flex flex-col items-center space-y-3">
            <div className="bg-[#FDF3F5] rounded-full h-16 w-16 flex justify-center items-center">
              <BsBarChart className="text-[#FD5171] text-3xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-2xl">423,39</span>
              <span className="text-sm text-[#9297A0]">Sales</span>
            </div>
          </div>

          <div className="w-[0.5px] h-full bg-gray-200"></div>

          <div className="flex-1 py-6 flex flex-col items-center space-y-3">
            <div className="bg-[#EBFAF2] rounded-full h-16 w-16 flex justify-center items-center">
              <LuRefreshCcw className="text-[#00C292] text-3xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-2xl">835</span>
              <span className="text-sm text-[#9297A0]">Refunds</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button
          className="border border-gray-300 px-2 py-2 rounded-lg hover:text-[#1E4DB7] hover:border-[#1E4DB7] text-sm flex items-center gap-1"
          onClick={() => setShowFilter(!showFilter)}
        >
          <IoFilter className="text-lg" />
          Filter
        </button>
        <div className="flex gap-2">
          <AddNewDropdown />

          <button className="border border-[#1E4DB7] text-[#1E4DB7] px-2 py-2 rounded-lg hover:bg-blue-100 text-sm flex items-center gap-1">
            <IoMdArrowUp className="text-lg" />
            Export
          </button>
        </div>
      </div>
      {showFilter && (
        <FilterBar onFilterChange={(filters) => console.log(filters)} />
      )}

      {/* Bảng sản phẩm */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="text-left text-[#1E4DB7] text-sm font-bold border-b border-gray-200 bg-[#F0F3FD]">
              <tr>
                <th className="py-4 px-6 w-[300px]">Product Name</th>
                <th className="py-4 px-4 w-[140px] text-center">Product Id</th>
                <th className="py-4 px-4 w-[140px] text-center">Stock</th>
                <th className="py-4 px-4 w-[120px] text-center">Price</th>
                <th className="py-4 px-4 w-[150px] text-center">Categories</th>
                <th className="py-4 px-4 w-[100px] text-center">Rate</th>
                <th className="py-4 px-4 w-[180px] text-center">Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentproducts.length > 0 ? (
                currentproducts.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`text-sm hover:bg-gray-50 transition ${
                      index !== currentproducts.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="py-4 px-6 w-[300px] text-left leading-5">
                      <span className="line-clamp-2">{order.name}</span>
                    </td>
                    <td className="p-4 w-[140px] text-center">{order.id}</td>
                    <td className="p-4 w-[140px] text-center font-medium">
                      {order.quantity === 0 ? (
                        <span className="text-red-500">Stock Out</span>
                      ) : order.quantity < 5 ? (
                        <span className="text-yellow-500">Stock Low</span>
                      ) : (
                        <span className="text-green-500">In Stock</span>
                      )}
                      <br />
                      <span className="font-normal">({order.quantity})</span>
                    </td>
                    <td className="p-4 w-[120px] text-center">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.price)}
                    </td>

                    <td className="p-4 w-[150px] text-center">
                      {order.category}
                    </td>

                    <td className="p-4 w-[100px] text-center">
                      ⭐ {order.rate}
                    </td>
                    <td className="p-4 w-[180px] text-center">
                      <span>{order.date}</span>
                      <br />
                      <span className="text-gray-500 text-xs">Last Edited</span>
                    </td>
                    <td className="py-4 px-6 text-center relative menu-container items-center ">
                      <div
                        className="p-2 rounded-full hover:text-[#1E4DB7] hover:bg-[#E7ECF7] cursor-pointer inline-flex items-center justify-center"
                        onClick={(e) => {
                          toggleMenu(order.id);
                        }}
                      >
                        <RiMore2Fill className="text-xl " />
                      </div>

                      {menuOpen === order.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10">
                          <button className="flex items-center w-full px-6 py-2 text-left hover:bg-gray-100">
                            <BiEditAlt className="mr-2" /> Edit
                          </button>
                          <div className="border-t border-gray-200"></div>
                          <button className="flex items-center w-full px-6 py-2 text-left hover:bg-gray-100 text-red-500">
                            <ImBin className="mr-2 text-red-500" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center text-gray-500">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Phân trang */}
      <div className="flex justify-center p-6">
        <CustomPagination
          current={currentPage}
          total={totalproducts.length} // Tổng số sản phẩm
          pageSize={productsPerPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default ManagerProducts;
