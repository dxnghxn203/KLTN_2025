import React, { useState } from "react";
import CustomPagination from "../../CustomPagination/customPagination";

const dataSource = [
  {
    key: "1",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 4,
    success: 2,
    status: 50,
  },
  {
    key: "2",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 20,
    success: 20,
    status: 100,
  },
  {
    key: "3",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "3",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "3",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "3",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
  {
    key: "3",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 10,
    success: 3,
    status: 30,
  },
];

const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => {
  let bgColor = "bg-orange-500"; // Mặc định màu cam
  if (percent === 100) {
    bgColor = "bg-green-500"; // 100% màu xanh lá
  } else if (percent > 50) {
    bgColor = "bg-blue-600"; // > 50% màu xanh biển
  }

  return (
    <div className="flex items-center w-full">
      <div className="relative w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${bgColor} h-2 rounded-full transition-all`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <span className="ml-2 text-black text-sm w-10 text-right">
        {percent}%
      </span>
    </div>
  );
};

export default function ManagerImport() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 6;
  const totalproducts = dataSource; // Không lấy length mà lấy toàn bộ mảng

  // Lọc các sản phẩm cho trang hiện tại
  const currentproducts = totalproducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  return (
    <div className="mt-4 bg-white shadow-sm rounded-2xl overflow-hidden">
      <table className="w-full ">
        {/* Header */}
        <thead>
          {/* Hàng tiêu đề chính */}
          <tr className="bg-[#F0F3FD] text-[#1E4DB7] text-sm font-bold text-center">
            <th className="px-4 py-4 border-r ">#</th>
            <th className="px-4 py-4 border-r ">Time</th>
            <th className="px-4 py-4 border-r " colSpan={2}>
              Quantity Product
            </th>
            <th className="px-4 py-4 border-r ">Status</th>
            <th className="px-4 py-4 ">Action</th>
          </tr>

          {/* Hàng tiêu đề phụ */}
          <tr className="bg-[#F0F3FD] text-[#1E4DB7] text-sm font-bold border-b border-gray-200 text-center">
            <th className="px-4 py-3 " colSpan={2}>
              {" "}
            </th>
            <th className="px-4 py-3 border-r ">Import</th>
            <th className="px-4 py-3 ">Success</th>
            <th className="px-4 py-3 " colSpan={2}>
              {" "}
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {currentproducts.map((item, index) => (
            <tr
              key={index} // Thêm key tránh lỗi React
              className={`text-sm text-center hover:bg-gray-50 transition ${
                index !== currentproducts.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >
              <td className="p-4">
                {(currentPage - 1) * productsPerPage + index + 1}
              </td>
              <td className="p-4">{item.time}</td>
              <td className="p-4">{item.import}</td>
              <td className="p-4">{item.success}</td>
              <td className="p-4 w-40">
                <ProgressBar percent={item.status} />
              </td>
              <td className="px-4 py-2">
                <a href="#" className="text-blue-600">
                  Detail
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center p-6">
        <CustomPagination
          current={currentPage}
          total={totalproducts.length} // Tổng số bản ghi
          pageSize={productsPerPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
