"use client";
import { useProduct } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { ImBin } from "react-icons/im";
import { IoImage } from "react-icons/io5";
import Image from "next/image";
import CustomPagination from "@/components/Admin/CustomPagination/customPagination";

const TableProduct = () => {
  const { allProductAdmin, getAllProductsAdmin } = useProduct();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const productsPerPage = 5;

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

  // Format giá tiền
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Tính số lượng sản phẩm trong kho
  const calculateTotalStock = (prices: any[]) => {
    if (!prices || prices.length === 0) return 0;
    return prices.reduce(
      (total, price) => total + (price.inventory - price.sell || 0),
      0
    );
  };

  // Lấy giá hiển thị
  const getPriceToDisplay = (prices: any[]) => {
    if (!prices || prices.length === 0) return 0;
    return prices[0].price;
  };

  // Lấy đơn vị sản phẩm
  const getUnitToDisplay = (prices: any[]) => {
    if (!prices || prices.length === 0) return "";
    return prices[0].unit;
  };

  // Phân trang
  const totalProducts = allProductAdmin ? allProductAdmin.length : 0;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProductAdmin
    ? allProductAdmin.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];

  return (
    <>
      {/* Bảng sản phẩm */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
              <tr className="uppercase text-sm">
                <th className="py-4 px-4 text-center w-[130px]">Hình ảnh</th>
                <th className="py-4 px-2 ">Tên sản phẩm</th>
                <th className="py-4 px-2 text-center">
                  Mã sản phẩm/ Mã danh mục
                </th>
                <th className="py-4 px-2 text-center w-[100px]">Kho</th>
                <th className="py-4 px-2 text-center">Giá</th>
                <th className="py-4 px-2 text-center">Danh mục</th>
                <th className="py-4 px-2 text-center">Xuất xứ</th>
                <th className="py-4 px-2 text-center">Thao tác</th>
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
                      <div className="text-xs text-gray-500 mt-1">
                        {product.name_primary.substring(0, 20)}...
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
                      {calculateTotalStock(product.prices) === 0 ? (
                        <span className="text-red-500">Hết hàng</span>
                      ) : calculateTotalStock(product.prices) < 10 ? (
                        <span className="text-yellow-500">Sắp hết</span>
                      ) : (
                        <span className="text-green-500">Còn hàng</span>
                      )}
                      <br />
                      <span className="font-normal">
                        ({calculateTotalStock(product.prices)})
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      {product.prices.map((p: any, idx: number) => (
                        <div key={idx} className="mb-1">
                          <span>{formatCurrency(p.price)}</span>
                          <span className="text-xs text-gray-500 ml-1">
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
                    <td className="py-4 px-2 w-[100px] text-center">
                      <span className="text-sm">{product.origin || "—"}</span>
                    </td>
                    <td className="py-4 px-2 text-center relative">
                      <div className="menu-container">
                        <div
                          className="py-4 px-2 rounded-full hover:text-[#1E4DB7] hover:bg-[#E7ECF7] cursor-pointer inline-flex items-center justify-center"
                          onClick={() => toggleMenu(product.product_id)}
                        >
                          <RiMore2Fill className="text-xl" />
                        </div>

                        {menuOpen === product.product_id && (
                          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10">
                            <button className="flex items-center w-full px-6 py-2 text-left hover:bg-gray-100">
                              <BiEditAlt className="mr-2" /> Chỉnh sửa
                            </button>
                            <div className="border-t border-gray-200"></div>
                            <button className="flex items-center w-full px-6 py-2 text-left hover:bg-gray-100 text-red-500">
                              <ImBin className="mr-2 text-red-500" /> Xóa
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

      {/* Phân trang */}
      <div className="flex justify-center p-6">
        <CustomPagination
          current={currentPage}
          total={totalProducts}
          pageSize={productsPerPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
};

export default TableProduct;
