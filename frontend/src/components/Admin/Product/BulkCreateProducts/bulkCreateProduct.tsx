import { useRef, useState } from "react";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import Link from "next/link";
import ManagerImport from "./managerImport";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";
import { GrDocumentCsv } from "react-icons/gr";
import { X } from "lucide-react";
import { TbFileTypeCsv } from "react-icons/tb";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaFileExcel } from "react-icons/fa6";
import { RiFileExcel2Fill } from "react-icons/ri";

const BulkCreateProduct = () => {
  const { fetchImportAddFileProduct, allFileImport } = useProduct();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadFile = () => {
    if (!selectedFile) {
      toast.showToast("Vui lòng chọn file Excel trước khi upload!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetchImportAddFileProduct(
      formData,
      () => {
        toast.showToast("Import file thành công", "success");
        handleCloseDialog();
        allFileImport();
      },
      (message: any) => {
        toast.showToast(message, "error");
      }
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-extrabold text-black mb-4">
        Thêm danh sách sản phẩm
      </h2>

      <div className="mb-6 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <span> / </span>
        <Link href="/bulk-create-product" className="text-gray-800">
          Thêm danh sách sản phẩm
        </Link>
      </div>

      <div className="flex justify-end gap-4 mb-6">
        {/* Nút chọn file mẫu */}
        <button
          className="text-sm flex items-center gap-1 px-2 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
          onClick={handleOpenDialog}
        >
          <RiFileExcel2Fill className="text-lg" /> Chọn file Excel
        </button>

        {/* Nút tải mẫu */}
        <button className="flex items-center gap-2 px-2 py-2 border border-[#1E4DB7] text-[#1E4DB7] rounded-lg text-sm font-medium hover:bg-gray-100 transition">
          <IoMdArrowDown /> Tải mẫu Excel
        </button>

        {/* Input file ẩn */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Quản lý file import */}
      <ManagerImport allFileImport={allFileImport} />

      {/* Modal Dialog Upload */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
              onClick={handleCloseDialog}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Upload file</h3>

            {/* Drag and Drop Area */}
            <div
              onDrop={handleDropFile}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-400 transition mb-6"
              onClick={handleChooseFile}
            >
              <div className="text-4xl mb-2">📄</div>
              <div>
                Kéo và thả tập tin ở đây hoặc{" "}
                <span className="text-blue-600 underline">Chọn file</span>
              </div>
              <div className="text-xs mt-2">
                Định dạng được hỗ trợ: .XLS, .XLSX (Tối đa 25MB)
              </div>
            </div>

            {/* Hiển thị file đã chọn */}
            {selectedFile && (
              <div className="text-sm text-gray-700 mb-4 flex space-x-1 items-center">
                <RiFileExcel2Fill /> <strong className="mr-2">Đã chọn:</strong>{" "}
                {selectedFile.name}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 text-sm">
              <button
                className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                onClick={handleCloseDialog}
              >
                Hủy
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedFile
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-white cursor-not-allowed"
                } transition`}
                onClick={handleUploadFile}
                disabled={!selectedFile}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkCreateProduct;
