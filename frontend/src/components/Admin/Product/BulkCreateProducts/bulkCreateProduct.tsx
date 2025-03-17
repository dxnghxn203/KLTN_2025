import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import bg from "@/images/download.png";
import Link from "next/link";
import ManagerImport from "./managerImport";

const BulkCreateProduct = () => {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-black">Import Product</h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Home
        </Link>
        <span> / </span>
        <Link href="/bulk-create-product" className="text-gray-800">
          Import Product
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4 pb-4">
        <button className="text-sm flex items-center gap-2 px-2 py-2 bg-[#1E4DB7] text-white rounded-xl shadow-md hover:bg-[#173F98] transition">
          <IoMdArrowDown /> Download sample
        </button>
        <button className="text-sm flex items-center gap-2 px-2 py-2 bg-[#1E4DB7] text-white rounded-xl shadow-md hover:bg-[#173F98] transition">
          <IoMdArrowUp /> Import Excel
        </button>
      </div>

      <ManagerImport />
    </div>
  );
};

export default BulkCreateProduct;
