import { PiCurrencyDollarSimple } from "react-icons/pi";
import { BsCurrencyDollar } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { BsBox } from "react-icons/bs";
import { BsBarChart } from "react-icons/bs";
import { LuRefreshCcw } from "react-icons/lu";
import CustomPagination from "@/components/Admin/CustomPagination/customPagination";
import bg from "@/images/download.png";
import { useState } from "react";

const ManagerProducts = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 6; // Số đơn hàng hiển thị trên mỗi trang

  return (
    <div>
      <div className="flex p-4 space-x-4">
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
        <div className="bg-white rounded-3xl flex w-full items-center justify-between shadow-sm">
          <div className="flex-1 flex flex-col items-center space-y-3">
            <div className="bg-[#EFF9FF] rounded-full h-12 w-12 flex justify-center items-center">
              <LuUsers className="text-[#1A97F5] text-xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-xl">39,354</span>
              <span className="text-sm text-[#9297A0]">Customers</span>
            </div>
          </div>

          <div className="w-[0.5px] h-full bg-gray-200"></div>

          <div className="flex-1 flex flex-col items-center space-y-3">
            <div className="bg-[#FFF4E5] rounded-full h-12 w-12 flex justify-center items-center">
              <BsBox className="text-[#FDC90F] text-xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-xl">4,396</span>
              <span className="text-sm text-[#9297A0]">Products</span>
            </div>
          </div>

          <div className="w-[0.5px] h-full bg-gray-200"></div>

          <div className="flex-1 flex flex-col items-center space-y-3">
            <div className="bg-[#FDF3F5] rounded-full h-12 w-12 flex justify-center items-center">
              <BsBarChart className="text-[#FD5171] text-xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-xl">423,39</span>
              <span className="text-sm text-[#9297A0]">Sales</span>
            </div>
          </div>

          <div className="w-[0.5px] h-full bg-gray-200"></div>

          <div className="flex-1 flex flex-col items-center space-y-3">
            <div className="bg-[#EBFAF2] rounded-full h-12 w-12 flex justify-center items-center">
              <LuRefreshCcw className="text-[#00C292] text-xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-xl">835</span>
              <span className="text-sm text-[#9297A0]">Refunds</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-2xl mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <thead className="text-sm border-b border-gray-200">
              <tr>
                <th className="p-6 text-left">Product Name</th>
                <th className="p-6 text-left">Product Id</th>
                <th className="p-6 text-left">Price</th>
                <th className="p-6 text-left">Category</th>
                <th className="p-6 text-left">Rate</th>
                <th className="p-6 text-center">Date</th>
                <th className="p-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* {currentOrders.map((order: any, index: any) => ( */}
              <tr
              // key={order.id}
              // className={`text-sm hover:bg-gray-50 transition ${
              //   index !== currentOrders.length - 1
              //     ? "border-b border-gray-200"
              //     : ""
              // }`}
              >
                <td className="p-6 text-left">hcdh</td>
                <td className="p-6 text-left">ff</td>
                <td className="p-6 text-left">ff</td>
                <td className="p-6 text-left">ff</td>
                <td className="p-6 text-left">ffnnnnnn</td>
                <td className="p-6 text-left">vvvvvvvvvvvvvv</td>
                <td className="p-6 flex items-center space-x-4"></td>
              </tr>
              {/* ))} */}
            </tbody>
          </table>
        </div>
        {/* CustomPagination */}
        <div className="flex justify-center p-6">
          <CustomPagination
            current={currentPage}
            total={length}
            pageSize={ordersPerPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerProducts;
