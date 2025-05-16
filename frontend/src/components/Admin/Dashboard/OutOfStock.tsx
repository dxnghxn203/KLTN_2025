// components/LatestOrders.jsx
import React, { useEffect, useState } from "react";
import { useProduct } from "@/hooks/useProduct";
import { MdMoreHoriz } from "react-icons/md";
import { IoImage } from "react-icons/io5";
import Image from "next/image";

export default function LatestOrders() {
  const { allProductAdmin, getAllProductsAdmin } = useProduct();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 10;

  // Lọc sản phẩm inventory < 10
  const lowInventoryProducts = allProductAdmin?.filter(
    (product: any) => product.inventory < 100
  );

  const totalProducts = lowInventoryProducts?.length || 0;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = lowInventoryProducts?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  useEffect(() => {
    getAllProductsAdmin();
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Sản phẩm sắp hết hàng</h2>
        <a href="/san-pham/quan-ly-san-pham" className="text-blue-500 text-sm">
          Xem tất cả
        </a>
      </div>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
              <tr className="uppercase text-sm">
                <th className="py-4 px-2 text-center w-[130px]">Hình ảnh</th>
                <th className="py-4 px-2">Tên sản phẩm</th>
                <th className="py-4 px-2 text-center">Mã sản phẩm</th>
                <th className="py-4 px-2 text-center">Kho</th>
                <th className="py-4 px-2 text-center">Bán</th>
                <th className="py-4 px-2 text-center">Giá</th>

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
                    <td className="py-4 px-2">
                      <div className="font-medium">{product.product_name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {product.name_primary}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center text-xs">
                      {product.product_id}
                    </td>
                    <td className="py-4 px-2 text-center font-medium">
                      {product.inventory - product.sell}{" "}
                      {product.prices.find((p: any) => p.amount === 1)?.unit}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {product.sell}{" "}
                      {product.prices.find((p: any) => p.amount === 1)?.unit}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {product.prices.map((p: any, idx: number) => (
                        <div key={idx}>
                          {p.price.toLocaleString("vi-VN")}đ / {p.unit}
                        </div>
                      ))}
                    </td>

                    <td className="py-4 px-2 text-center">
                      <div className="p-2 rounded-full hover:text-[#1E4DB7] hover:bg-[#E7ECF7] cursor-pointer">
                        <MdMoreHoriz className="text-xl" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
