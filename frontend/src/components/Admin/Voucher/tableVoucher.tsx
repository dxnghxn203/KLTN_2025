"use client";
import { useProduct } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import { ImBin } from "react-icons/im";
import { IoImage } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MdModeEdit,
  MdMoreHoriz,
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineModeEdit,
} from "react-icons/md";
import { useToast } from "@/providers/toastProvider";
import { useVoucher } from "@/hooks/useVoucher";
import DeleteProductDialog from "../Dialog/confirmDeleteProductDialog";
import { FaRegTrashAlt } from "react-icons/fa";
interface TableVoucherProps {
  allVouchers: any[];
}

const TableVoucher = ({ allVouchers }: TableVoucherProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const router = useRouter();
  const { fetchAllVouchers, fetchDeleteVoucher, fetchUpdateStatusVoucher } =
    useVoucher();

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toast = useToast();
  const productsPerPage = 10;

  useEffect(() => {
    fetchAllVouchers(
      currentPage,
      productsPerPage,
      () => {},
      () => {}
    );
  }, []);
  const onDelete = () => {
    fetchDeleteVoucher(
      selectedProduct.voucher_id,
      () => {
        toast.showToast("Xóa voucher thành công", "success");
        fetchAllVouchers(
          1,
          100,
          () => {},
          () => {}
        );
        setIsOpenDialog(false);
      },
      () => {
        toast.showToast("Xóa voucher thất bại", "error");
      }
    );
  };
  const handleToggleStatus = (voucher: any) => {
    const newStatus = !voucher.active;
    fetchUpdateStatusVoucher(
      { voucher_id: voucher.voucher_id, status_voucher: newStatus },
      () => {
        toast.showToast("Cập nhật trạng thái thành công", "success");
        fetchAllVouchers(
          1,
          100,
          () => {},
          () => {}
        );
      },
      () => {
        toast.showToast("Cập nhật trạng thái tphcm", "error");
      }
    );
  };

  const toggleMenu = (productId: string) => {
    setMenuOpen(menuOpen === productId ? null : productId);
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

  // Phân trang
  const totalProducts = allVouchers ? allVouchers.length : 0;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allVouchers?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
              <tr className="uppercase text-sm">
                <th className="p-4 text-center whitespace-nowrap">
                  Mã Voucher
                </th>
                <th className="p-4 text-left whitespace-nowrap">
                  Loại Voucher
                </th>
                <th className="p-4 text-center w-[250px]">Mô tả</th>
                <th className="p-4 text-center whitespace-nowrap">Giảm giá</th>
                <th className="p-4 text-center whitespace-nowrap">Giá trị</th>
                <th className="p-4 text-center whitespace-nowrap">
                  Trạng thái
                </th>
                <th className="p-4 text-center whitespace-nowrap"></th>
              </tr>
            </thead>

            <tbody>
              {currentProducts && currentProducts.length > 0 ? (
                currentProducts.map((voucher: any, index: number) => (
                  <tr
                    key={voucher.product_id}
                    className={`text-sm hover:bg-gray-50 transition ${
                      index !== currentProducts.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="p-4 text-center">{voucher.voucher_id}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${
                        voucher.voucher_type === "order"
                          ? "bg-orange-100 text-orange-600"
                          : voucher.voucher_type === "delivery"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-400"
                      }
                    `}
                      >
                        {voucher.voucher_type}
                      </span>
                    </td>

                    <td className="p-4 text-center max-w-[250px]">
                      <div
                        className="line-clamp-3 text-ellipsis overflow-hidden"
                        title={voucher.description}
                      >
                        {voucher.description}
                      </div>
                    </td>

                    <td className="p-4 text-center">{voucher.discount}%</td>
                    <td className="p-4 text-center">
                      <span className="text-red-500 font-medium">
                        {voucher.min_order_value.toLocaleString("vi-VN")}đ
                      </span>{" "}
                      →{" "}
                      <span className="text-green-600 font-medium">
                        {voucher.max_discount_value.toLocaleString("vi-VN")}đ
                      </span>
                    </td>

                    <td className="p-4 ">
                      <div className="flex justify-center items-center">
                        {voucher.expired_date &&
                        new Date(voucher.expired_date) < new Date() ? (
                          <span className="text-red-500 font-medium">
                            Hết hạn
                          </span>
                        ) : (
                          <div>
                            Còn{" "}
                            {Math.ceil(
                              (new Date(voucher.expired_date).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            ngày
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-4">
                        <button className="text-blue-800 font-medium flex items-center">
                          <MdModeEdit className="text-blue-800 mr-1" />
                          Sửa
                        </button>
                        <button
                          className="text-red-700 font-medium flex items-center"
                          onClick={() => {
                            setIsOpenDialog(true);
                            setSelectedProduct(voucher);
                          }}
                        >
                          <FaRegTrashAlt className="text-red-700 mr-1" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    Không có voucher nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <span className="text-sm text-gray-700">
          Hiện có {totalProducts} voucher
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Hiển thị {indexOfFirstProduct + 1} đến{" "}
            {Math.min(indexOfLastProduct, totalProducts)} trong số{" "}
            {totalProducts} voucher
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
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
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1) ||
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

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
        >
          <MdNavigateNext className="text-xl" />
        </button>
        <DeleteProductDialog
          isOpen={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
          onDelete={onDelete}
        />
      </div>
    </>
  );
};

export default TableVoucher;
