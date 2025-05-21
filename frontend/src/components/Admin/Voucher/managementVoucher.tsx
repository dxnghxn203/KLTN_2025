"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/providers/toastProvider";
import TableVoucher from "./tableVoucher";
import { useVoucher } from "@/hooks/useVoucher";
import AddVoucherDialog from "../Dialog/addVoucherDialog";

const VoucherManagement = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const toast = useToast();
  const { allVouchers, fetchAllVouchers } = useVoucher();

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">Quản lý Voucher</h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Dashboard
          </Link>
          <span> / </span>
          <Link href="/order" className="text-gray-850">
            Quản lý Voucher
          </Link>
        </div>
        <div className="flex justify-end items-center">
          <div
            className="flex gap-2 px-2 py-2 rounded-lg text-sm flex items-center bg-blue-700 text-white cursor-pointer hover:bg-blue-800"
            onClick={() => setIsOpenDialog(true)}
          >
            + Thêm voucher
          </div>
        </div>
        <TableVoucher allVouchers={allVouchers} />
      </div>
      <AddVoucherDialog isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} />
    </div>
  );
};

export default VoucherManagement;
