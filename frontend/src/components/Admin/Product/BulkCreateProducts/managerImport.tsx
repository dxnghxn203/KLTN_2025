import React, { useEffect, useState } from "react";
import CustomPagination from "../../CustomPagination/customPagination";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";
import { selectAllFileImport } from "@/store";

const dataSource = [
  {
    key: "1",
    time: "17:00 11/12/2024",
    location: "66d7f88f1627385750c99b2e",
    import: 4,
    success: 2,
    status: 70,
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
  const [currentPage, setCurrentPage] = useState<number>(1);

  let bgColor = "bg-orange-500"; // Mặc định màu cam

  if (percent === 100) {
    bgColor = "bg-green-500"; // 100% màu xanh lá
  } else if (percent > 50) {
    bgColor = "bg-blue-600"; // > 50% màu xanh biển
  } else {
    bgColor = "bg-orange-500"; // Giữ nguyên màu cam nếu <= 50%
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

interface ManagerImportProps {
  allFileImport: any;
}

const ManagerImport = ({ allFileImport }: ManagerImportProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 6;
  const totalproducts = dataSource;
  const { fetchGetImportFileAddProduct } = useProduct();
  const toast = useToast();
  // const totalProducts = allProductAdmin ? allProductAdmin.length : 0;
  // Lọc các sản phẩm cho trang hiện tại
  const currentproducts = totalproducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    fetchGetImportFileAddProduct(
      (message: any) => {
        toast.showToast(message, "success");
      },
      (message: any) => {
        toast.showToast(message, "error");
      }
    );
  }, []);
  console.log("allFileiImport", allFileImport);
  // const totalPages = Math.ceil(totalproducts / productsPerPage);
  return (
    <div className="mt-4 bg-white shadow-sm rounded-2xl overflow-hidden">
      <table className="divide-y divide-gray-200 w-full">
        {/* Header */}
        <thead className="text-[#1E4DB7] text-sm font-bold bg-[#F0F3FD]">
          <tr className="">
            <th className="px-4 py-4 text-xs uppercase tracking-wider text-center">
              STT
            </th>

            <th className="px-4 py-4 text-xs uppercase tracking-wider text-center">
              Mã Import
            </th>

            <th className="px-4 py-4 text-xs uppercase tracking-wider text-center">
              File URL
            </th>

            <th className="px-4 py-4 text-xs uppercase tracking-wider text-center">
              Trạng thái
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {allFileImport.map((file: any, indexa: any) => (
            <tr
              key={file.import_id} // Thêm key tránh lỗi React
              className={`text-sm text-left hover:bg-gray-50 transition ${
                file !== allFileImport.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >
              <td className="px-4">{indexa + 1}</td>
              <td className="px-4">{file.import_id}</td>
              <td className="px-2 ">{file.file_url}</td>
              <td className="px-2">
                <td className="px-4">
                  {Array.isArray(file.error_message) ? (
                    file.error_message.map((msg: string, i: number) =>
                      msg.split("\n").map((line, j) => (
                        <div
                          key={`${i}-${j}`}
                          className="text-red-600 font-semibold"
                        >
                          {line}
                        </div>
                      ))
                    )
                  ) : (
                    <div className="text-green-700 bg-green-100 py-1 px-2 rounded-full">
                      Thành công
                    </div>
                  )}
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="flex items-center justify-center space-x-2 py-4">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
              >
                <MdNavigateBefore className="text-xl" />
              </button>
      
              {Array.from({ length: totalPages }, (_, idx) => {
                const page = idx + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        currentPage === page
                          ? "bg-blue-700 text-white"
                          : "text-black hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                if (
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={page} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}
      
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
              >
                <MdNavigateNext className="text-xl" />
              </button>
            </div> */}
    </div>
  );
};

export default ManagerImport;
