"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import TableManagementDiscount from "./tableManagementDiscount";
import SearchProductDialog from "../Dialog/searchProductDialog";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";

const DiscountManagement = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isApproved, setIsApproved] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const toast = useToast();
  const {
    allProductDiscountAdmin,
    fetchGetProductDiscountAdmin,
    totalProductDiscountAdmin,
    page,
    setPage,
    pageSize,
    setPageSize
  } = useProduct();

  useEffect(() => {
    fetchGetProductDiscountAdmin(isApproved);
  }, [isApproved, page, pageSize]);

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">
          Tạo chiến dịch giảm giá
        </h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Dashboard
          </Link>
          <span> / </span>
          <Link href="/quan-ly-giam-gia" className="text-gray-850">
            Tạo chiến dịch giảm giá
          </Link>
        </div>
        <div className="flex justify-end items-center">
          <div
            className="flex gap-2 px-2 py-2 rounded-lg text-sm items-center bg-blue-700 text-white cursor-pointer hover:bg-blue-800"
            onClick={() => setIsOpenDialog(true)}
          >
            + Thêm giảm giá
          </div>
        </div>
        <TableManagementDiscount
          allProductDiscountAdmin={allProductDiscountAdmin}
          totalProductDiscountAdmin={totalProductDiscountAdmin}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          isApproved={isApproved}
          setIsApproved={setIsApproved}
        />
      </div>
      <SearchProductDialog
        isOpen={isOpenDialog}
        setIsOpen={setIsOpenDialog}
        onSelectProduct={(product) => {
          if (
            selectedProduct.some(
              (p: any) => p.product_id === product.product_id
            )
          ) {
            toast.showToast("Sản phẩm đã được thêm", "error");
            return;
          }
          const defaultPrice = product.prices?.[0];
          const defaultUnit = defaultPrice?.price_id;
          setSelectedProduct((prev: any) => [
            ...prev,
            {
              ...product,
              quantity: 1,
              unit: defaultUnit,
            },
          ]);
        }}
        allProductDiscountAdmin={allProductDiscountAdmin}
        isApproved={isApproved}
        totalProductDiscountAdmin={totalProductDiscountAdmin}
      />
    </div>
  );
};

export default DiscountManagement;
