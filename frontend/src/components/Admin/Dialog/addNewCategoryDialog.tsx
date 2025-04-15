import { useState } from "react";
import { X } from "lucide-react";
import { ImBin } from "react-icons/im";

interface AddNewCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNewCategoryDialog: React.FC<AddNewCategoryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [subCategories1, setSubCategories1] = useState([{ name: "", url: "" }]);
  const [subCategories2, setSubCategories2] = useState([{ name: "", url: "" }]);

  const addSubCategory1 = () => {
    setSubCategories1([...subCategories1, { name: "", url: "" }]);
  };

  const removeSubCategory1 = (index: number) => {
    const newList = [...subCategories1];
    newList.splice(index, 1);
    setSubCategories1(newList);
  };

  const addSubCategory2 = () => {
    setSubCategories2([...subCategories2, { name: "", url: "" }]);
  };

  const removeSubCategory2 = (index: number) => {
    const newList = [...subCategories2];
    newList.splice(index, 1);
    setSubCategories2(newList);
  };

  const handleSubmit = () => {
    // Xử lý thêm danh mục ở đây
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-lg text-center font-semibold mb-4">
          Thêm danh mục
        </h2>

        {/* Danh mục chính */}
        <div className="flex gap-4">
          <input
            type="text"
            className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm"
            placeholder="Tên danh mục chính"
          />
          <input
            type="text"
            className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm"
            placeholder="URL danh mục chính"
          />
        </div>

        {/* Danh mục cấp 1 */}
        {subCategories1.map((item, index) => (
          <div key={index} className="relative mt-4">
            <button
              type="button"
              onClick={() => removeSubCategory1(index)}
              className="absolute -top-3 right-0 text-red-500  bg-[#FDF3F5] rounded-full p-2"
            >
              <ImBin className="w-4 h-4 text-[#D4380D] hover:text-red-700" />
            </button>
            <div className="flex gap-4">
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm"
                placeholder="Tên danh mục cấp 1"
              />
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm"
                placeholder="URL danh mục cấp 1"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSubCategory1}
          className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Thêm danh mục cấp 1
        </button>

        {/* Danh mục cấp 2 */}
        {subCategories2.map((item, index) => (
          <div key={index} className="relative mt-4">
            <button
              type="button"
              onClick={() => removeSubCategory2(index)}
              className="absolute -top-3 right-0 text-red-500  bg-[#FDF3F5] rounded-full p-2"
            >
              <ImBin className="w-4 h-4 text-[#D4380D] hover:text-red-700" />
            </button>
            <div className="flex gap-4">
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm"
                placeholder="Tên danh mục cấp 2"
              />
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm"
                placeholder="URL danh mục cấp 2"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSubCategory2}
          className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Thêm danh mục cấp 2
        </button>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={onClose}
            className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-semibold py-2 px-6 rounded-xl"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-xl hover:bg-[#002E99]"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewCategoryDialog;
