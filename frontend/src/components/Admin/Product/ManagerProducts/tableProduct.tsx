"use client";
import { useProduct } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import { ImBin } from "react-icons/im";
import { IoImage } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MdMoreHoriz,
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineModeEdit,
} from "react-icons/md";
import DeleteProductDialog from "../../Dialog/confirmDeleteProductDialog";
import { useToast } from "@/providers/toastProvider";
import { FiEye } from "react-icons/fi";

const TableProduct = () => {
  const { allProductAdmin, getAllProductsAdmin, deleteProduct } = useProduct();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const router = useRouter();

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toast = useToast();
  const productsPerPage = 20;

  useEffect(() => {
    getAllProductsAdmin();
  }, []);

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
  const totalProducts = allProductAdmin ? allProductAdmin.length : 0;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  console.log("Tổng số sản phẩm:", totalProducts);
  const currentProducts = allProductAdmin
    ? allProductAdmin.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];
  // console.log("Product ID đã chọn:", selectedProduct?.product_id);
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  // console.log("Tổng số trang:", totalPages);
  // console.log("Sản phẩm hiện tại:", currentProducts);
  // console.log("Sản phẩm hiện tại:", currentProducts.length);
  console.log("Sản phẩm hiện tại:", allProductAdmin);

  return (
    <>
      {/* Bảng sản phẩm */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
              <tr className="uppercase text-sm">
                <th className="py-4 px-2 text-center w-[130px]">Hình ảnh</th>
                <th className="py-4 px-2 ">Tên sản phẩm</th>
                <th className="py-4 px-2 text-center">Mã sản phẩm/ danh mục</th>
                <th className="py-4 px-8 text-center">Kho</th>
                <th className="py-4 px-2 text-center">Bán</th>
                <th className="py-4 px-2 text-center">Giá</th>
                <th className="py-4 px-2 text-center">Danh mục</th>
                <th className="py-4 px-2 text-center"></th>
              </tr>
            </thead>

            <tbody>
              {currentProducts && currentProducts.length > 0 ? (
                currentProducts.map((product: any, index: number) => (
                  <tr
                    key={product.product_id}
                    className={`text-sm hover:bg-gray-50 transition ${
                      index !== currentProducts.length - 1
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
                    <td className="py-4 px-2 text-center font-medium">
                      <span className="font-normal">
                        {product.inventory}{" "}
                        {product.prices.find((p: any) => p.amount === 1)?.unit}
                      </span>
                      <br />
                      {product.inventory === 0 ? (
                        <span className="text-red-500">Hết hàng</span>
                      ) : product.inventor < 60 ? (
                        <span className="text-yellow-500">Sắp hết</span>
                      ) : (
                        <span className="text-green-500">Còn hàng</span>
                      )}
                    </td>
                    <td className="py-4 px-2 w-[100px] text-center">
                      <span className="text-sm">
                        {product.sell}{" "}
                        {product.prices.find((p: any) => p.amount === 1)?.unit}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      {product.prices.map((p: any, idx: number) => (
                        <div key={idx} className="mb-2">
                          <span>{p.price.toLocaleString("vi-VN")}đ</span>
                          <span className="text-xs text-gray-500">
                            / {p.unit}
                          </span>
                        </div>
                      ))}
                    </td>

                    <td className="py-4 px-2 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {product.category.main_category_name}
                        </span>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          {product.category.sub_category_name}
                        </span>
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                          {product.category.child_category_name}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-2 text-center relative">
                      <div className="menu-container">
                        <div
                          className="p-2 rounded-full hover:text-[#1E4DB7] hover:bg-[#E7ECF7] cursor-pointer inline-flex items-center justify-center"
                          onClick={() => toggleMenu(product.product_id)}
                        >
                          <MdMoreHoriz className="text-xl" />
                        </div>

                        {menuOpen === product.product_id && (
                          <div className="absolute right-0 bg-white border rounded-lg shadow-lg z-10 w-32 items-center">
                            <button className="flex items-center gap-1 w-full px-4 py-2 text-sm hover:bg-gray-100 space-x-1">
                              <FiEye className="text-base" />
                              <span>Chi tiết</span>
                            </button>
                            <button
                              className="flex items-center gap-1 w-full px-4 py-2 text-sm hover:bg-gray-100 space-x-1"
                              onClick={() => {
                                router.push(
                                  `/san-pham/them-san-pham-don?edit=${product.slug}`
                                );
                              }}
                            >
                              <MdOutlineModeEdit className="text-base" />

                              <span>Sửa</span>
                            </button>

                            <button
                              className="flex items-center gap-1 w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-500 space-x-1"
                              onClick={() => {
                                setSelectedProduct(product); // Lưu product hiện tại
                                setIsOpenDialog(true); // Mở dialog xác nhận xóa
                              }}
                            >
                              <ImBin className="text-base text-sm" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        )}
                      </div>
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
      <DeleteProductDialog
        onClose={() => setIsOpenDialog(false)}
        onDelete={() => {
          deleteProduct(
            selectedProduct.product_id,
            (message) => {
              toast.showToast(message, "success");
              getAllProductsAdmin();
              setIsOpenDialog(false);
              setSelectedProduct(null);
            },
            (message) => {
              toast.showToast(message, "error");
            }
          );
        }}
        isOpen={isOpenDialog}
      />

      {/* Phân trang */}
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

        {/* Nút next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
        >
          <MdNavigateNext className="text-xl" />
        </button>
      </div>
    </>
  );
};

export default TableProduct;
