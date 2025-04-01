import { BsInboxes } from "react-icons/bs";
import { BsClipboardPlus } from "react-icons/bs";
import { BsFolderPlus } from "react-icons/bs";
import Link from "next/link";
const Product = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <Link href="/san-pham/them-san-pham-don">
        <div className="flex-1 flex flex-col items-center space-y-6 p-6 rounded-2xl bg-white shadow-sm">
          <div className="bg-[#EFF9FF] rounded-full h-20 w-20 flex justify-center items-center">
            <BsClipboardPlus className="text-[#1A97F5] text-4xl" />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium font-semibold  text-xl">
              Create Product
            </span>
            <span className="text-sm text-[#9297A0]">
              Create new single product
            </span>
          </div>
        </div>
      </Link>
      <Link href="/san-pham/them-san-pham-hang-loat">
        <div className="flex-1 flex flex-col items-center space-y-6 p-6 rounded-2xl bg-white shadow-sm">
          <div className="bg-[#FFF4E5] rounded-full h-20 w-20 flex justify-center items-center">
            <BsFolderPlus className="text-[#FDC90F] text-4xl" />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-xl">Bulk Create Products</span>
            <span className="text-sm text-[#9297A0]">
              Import product from Excel/ CSV
            </span>
          </div>
        </div>
      </Link>

      <Link href="/san-pham/quan-ly-san-pham">
        <div className="flex-1 flex flex-col items-center space-y-6 p-6 rounded-2xl bg-white shadow-sm">
          <div className="bg-[#EBFAF2] rounded-full h-20 w-20 flex justify-center items-center">
            <BsInboxes className="text-[#00C292] text-4xl" />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-xl">Manager Products</span>
            <span className="text-sm text-[#9297A0]">
              Track and manager product
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Product;
