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
import ApproveProductDialog from "../Dialog/approveProductDialog";
import { FiEye } from "react-icons/fi";
import { LuBadgeCheck, LuEye } from "react-icons/lu";

const MedicineCensorshipList = () => {
  const { productApproved, fetchProductApproved } = useProduct();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const productApprovedPerPage = 10; // Số đơn hàng hiển thị trên mỗi trang

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
                          className={`px-2 py-1 rounded-full ${
                            product.verified_by === ""
                              ? "bg-yellow-100 text-yellow-700"
                              : product.is_approved === true
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.verified_by === ""
                            ? "Đang chờ"
                            : product.is_approved === true
                            ? "Đã duyệt"
                            : "Từ chối"}
                        </span>
                      </td>

                      <td className="py-4 px-2 text-center relative w-[120px]">
                        {product.verified_by !== "" ? (
                          <button
                            className="px-3 py-2 font-medium flex items-center gap-1 text-sm text-gray-500"
                            onClick={() => {
                              setDialogOpen(true);
                              setSelectedProductApproved(product);
                            }}
                          >
                            <FiEye className="text-gray-500 text-lg" />
                            Chi tiết
                          </button>
                        ) : (
                          <button
                            className="underline px-3 py-2 text-blue-600 font-medium rounded-lg  flex items-center gap-2 text-sm"
                            onClick={() => {
                              setDialogOpen(true);
                              setSelectedProductApproved(product);
                            }}
                          >
                            <LuBadgeCheck className="text-blue-600 text-lg" />
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
      {isDialogOpen && selectedProductApproved && (
        <ApproveProductDialog
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          productSelected={selectedProductApproved}
        />
      )}
    </div>
  );
};

export default MedicineCensorshipList;
