"use client";
import { useState, useEffect } from "react";
import CustomPagination from "@/components/Admin/CustomPagination/customPagination";
import Link from "next/link";
import { X } from "lucide-react";
import Image from "next/image";
import { RiMore2Fill } from "react-icons/ri";
import { IoFilter, IoImage } from "react-icons/io5";
import FilterBar from "./filterBar";
import { useProduct } from "@/hooks/useProduct";
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineModeEdit,
} from "react-icons/md";

const MedicineCensorshipList = () => {
  const { productApproved, fetchProductApproved } = useProduct();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const productApprovedPerPage = 6; // Số đơn hàng hiển thị trên mỗi trang

  // Tính toán dữ liệu hiển thị theo trang
  const totalProducts = productApproved ? productApproved.length : 0;
  const indexOfLastProductApproved = currentPage * productApprovedPerPage;
  const indexOfFirstProductApproved =
    indexOfLastProductApproved - productApprovedPerPage;
  const currentProductApproved = productApproved
    ? productApproved.slice(
        indexOfFirstProductApproved,
        indexOfLastProductApproved
      )
    : [];
  const totalPages = Math.ceil(totalProducts / productApprovedPerPage);
  const [selectedProductApproved, setSelectedProductApproved] =
    useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchProductApproved();
  }, [productApproved]);

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">
          Danh sách kiểm duyệt thuốc
        </h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Dashboard
          </Link>
          <span> / </span>
          <Link href="/order" className="text-gray-800">
            Danh sách kiểm duyệt thuốc
          </Link>
        </div>

        <div className="flex justify-between">
          <button
            className="justify-start border border-gray-300 px-2 py-2 rounded-lg hover:text-[#1E4DB7] hover:border-[#1E4DB7] text-sm flex items-center gap-1"
            onClick={() => setShowFilter(!showFilter)}
          >
            <IoFilter className="text-lg" />
            Filter
          </button>
        </div>
        {showFilter && (
          <FilterBar onFilterChange={(filters) => console.log(filters)} />
        )}

        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
                <tr className="uppercase text-sm">
                  <th className="py-3 px-2 text-center w-[130px]">Hình ảnh</th>
                  <th className="py-3 px-2 ">Tên sản phẩm</th>
                  <th className="py-3 px-2 text-center">
                    Mã sản phẩm/ danh mục
                  </th>
                  <th className="py-3 px-4 text-center">Thuốc kê toa</th>
                  <th className="py-3 px-6 text-center">Trạng thái</th>
                  <th className="py-3 px-2 text-center"></th>
                </tr>
              </thead>

              <tbody>
                {currentProductApproved && currentProductApproved.length > 0 ? (
                  currentProductApproved.map((product: any, index: number) => (
                    <tr
                      key={product.product_id}
                      className={`text-sm hover:bg-gray-50 transition ${
                        index !== currentProductApproved.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <td className="py-4 px-4 text-center">
                        {product.images_primary ? (
                          <div className="relative h-16 w-16 mx-auto">
                            <Image
                              src={product.images_primary}
                              alt={product.product_name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded mx-auto">
                            <IoImage className="text-gray-400 text-xl" />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-2 text-left leading-5">
                        <div className="line-clamp-2 font-medium">
                          {product.product_name}
                        </div>
                        <div className="line-clamp-2 text-xs text-gray-500 mt-1">
                          {product.name_primary}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center text-xs flex flex-col gap-2 items-center justify-center">
                        <span className="font-semibold">
                          {product.product_id}
                        </span>
                        <span
                          className="
                              px-2 py-1 bg-blue-100 text-blue-700 rounded-full w-fit"
                        >
                          {product.category?.main_category_id}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full w-fit">
                          {product.category?.sub_category_id}
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full w-fit">
                          {product.category?.child_category_id}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <span
                          className={`${
                            product?.prescription_required
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          } px-2 py-1 rounded-full`}
                        >
                          {product?.prescription_required ? "Có" : "Không"}
                        </span>
                      </td>

                      <td className="py-4 px-2 text-center w-fit">
                        <span
                          className={`${
                            product.verified_by !== ""
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          } px-2 py-1 rounded-full`}
                        >
                          {product.verified_by !== "" ? "Đã duyệt" : "Đang chờ"}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center relative">
                        {product.verified_by === "" && (
                          <button className="px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                            Duyệt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* CustomPagination */}
        <div className="flex items-center justify-center space-x-2 py-4">
          {/* Nút previous */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
          >
            <MdNavigateBefore className="text-xl" />
          </button>

          {/* Các nút số trang */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;

            // Quy tắc ẩn bớt số
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 &&
                pageNumber <= currentPage + 1) ||
              (currentPage <= 3 && pageNumber <= 5) ||
              (currentPage >= totalPages - 2 && pageNumber >= totalPages - 4)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                    currentPage === pageNumber
                      ? "bg-blue-700 text-white"
                      : "text-black hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }

            // Hiển thị dấu ...
            if (
              (pageNumber === currentPage - 2 && currentPage > 4) ||
              (pageNumber === currentPage + 2 && currentPage < totalPages - 3)
            ) {
              return (
                <span key={pageNumber} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            return null;
          })}

          {/* Nút next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
          >
            <MdNavigateNext className="text-xl" />
          </button>
        </div>
        {/* Drawer (Chi tiết đơn hàng) */}
      </div>
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-[400px] h-full shadow-lg p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">
                ProductApproved #{selectedProductApproved?.id}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="text-2xl text-gray-700" />
              </button>
            </div>

            <div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold my-4">
                  ProductApproved items{" "}
                  <span className="text-gray-500 ml-1">
                    {selectedProductApproved?.products?.length || 0}
                  </span>
                </h2>

                {Array.isArray(selectedProductApproved?.products) &&
                  selectedProductApproved.products.map(
                    (product: any, index: number) => (
                      <div
                        key={index}
                        className="border-b pb-3 flex items-center space-x-4"
                      >
                        <Image
                          src={product?.img}
                          alt={product?.name}
                          className="w-16 h-16 rounded-lg border border-gray-300"
                        />
                        <div className="flex-1">
                          <p className="text-sm line-clamp-2">
                            {product?.name}
                          </p>
                        </div>
                        <span className="space-x-4">
                          <span className="font-semibold">
                            {product?.quantity || 0}
                          </span>
                          <span className="font-normal text-gray-500">x</span>
                          <span className="font-semibold">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product?.price || 0)}
                          </span>
                        </span>
                      </div>
                    )
                  )}

                <div className="mt-3 text-right text-lg text-gray-500">
                  Total
                  <span className="ml-4 text-black font-semibold">
                    {selectedProductApproved?.total?.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <h2 className="text-lg font-semibold my-4">Contact</h2>
                <div className="gap-4">
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Customer:</p>
                    <p className="w-2/3">
                      {selectedProductApproved?.customer?.name}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Phone:</p>
                    <p className="w-2/3">
                      {selectedProductApproved?.customer?.phone}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Email:</p>
                    <p className="w-2/3">
                      {selectedProductApproved?.customer?.email}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Address:</p>
                    <p className="w-2/3">
                      {selectedProductApproved?.customer?.address
                        ? `${selectedProductApproved.customer.address.street}, ${selectedProductApproved.customer.address.ward}, ${selectedProductApproved.customer.address.district}, ${selectedProductApproved.customer.address.city}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-[#1E4DB7] text-white px-2 text-sm py-2 rounded-lg hover:bg-[#173F98]">
                Download Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineCensorshipList;
