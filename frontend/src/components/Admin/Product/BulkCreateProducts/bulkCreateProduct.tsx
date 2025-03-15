import { PiCurrencyDollarSimple } from "react-icons/pi";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoInbox } from "react-icons/go";
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

      <div className="flex space-x-4">
        <div className="bg-[#E7ECF7] rounded-3xl p-6 flex items-center justify-between w-full max-w-xs relative overflow-hidden">
          {/* Hình ảnh góc */}
          <div
            className="absolute bottom-0 right-0 w-40 h-40 bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${bg.src})` }}
          ></div>

          {/* Cột trái */}
          <div className="space-y-4 relative z-10">
            <span className="text-black text-lg font-medium">
              Total Products
            </span>
            <div className="flex text-[#1E4DB7] text-2xl items-center">
              <span className="font-medium">63,438.78</span>
            </div>
          </div>

          {/* Cột phải */}
          <div className="bg-[#1E4DB7] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10">
            <GoInbox className="text-white text-2xl" />
          </div>
        </div>
        <div className="bg-[#E7ECF7] rounded-3xl p-6 flex items-center justify-between w-full max-w-xs relative overflow-hidden">
          {/* Hình ảnh góc */}
          <div
            className="absolute bottom-0 right-0 w-40 h-40 bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${bg.src})` }}
          ></div>

          {/* Cột trái */}
          <div className="space-y-4 relative z-10">
            <span className="text-black text-lg font-medium">Earnings</span>
            <div className="flex text-[#1E4DB7] text-2xl items-center">
              <BsCurrencyDollar />
              <span className="font-medium">63,438.78</span>
            </div>
            <button className="bg-[#1E4DB7] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#173F98]">
              Download
            </button>
          </div>

          {/* Cột phải */}
          <div className="bg-[#1E4DB7] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10">
            <PiCurrencyDollarSimple className="text-white text-2xl" />
          </div>
        </div>
        <div className="bg-[#E7ECF7] rounded-3xl p-6 flex items-center justify-between w-full max-w-xs relative overflow-hidden">
          {/* Hình ảnh góc */}
          <div
            className="absolute bottom-0 right-0 w-40 h-40 bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${bg.src})` }}
          ></div>

          {/* Cột trái */}
          <div className="space-y-4 relative z-10">
            <span className="text-black text-lg font-medium">Earnings</span>
            <div className="flex text-[#1E4DB7] text-2xl items-center">
              <BsCurrencyDollar />
              <span className="font-medium">63,438.78</span>
            </div>
            <button className="bg-[#1E4DB7] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#173F98]">
              Download
            </button>
          </div>

          {/* Cột phải */}
          <div className="bg-[#1E4DB7] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10">
            <PiCurrencyDollarSimple className="text-white text-2xl" />
          </div>
        </div>
      </div>
      <ManagerImport />
    </div>
  );
};

export default BulkCreateProduct;
