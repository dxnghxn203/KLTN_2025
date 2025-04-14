import { useState } from "react";
import { ImBin } from "react-icons/im";
import { MdOutlineModeEdit } from "react-icons/md";
import UpdateSubCategoryDialog from "../Dialog/updateSubCategoryDialog";

export default function SubCategoryList({
  categoryAdmin,
  selectedMainId,
}: any) {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedLevel1Id, setSelectedLevel1Id] = useState<number | null>(null);
  //   const [selectedMainId, setSelectedMainId] = useState<number | null>(null);
  const selectedMain = categoryAdmin.find(
    (d: any) => d?.main_category_id === selectedMainId
  );
  const selectedLevel1 = selectedMain?.sub_category.find(
    (l1: any) => l1.sub_category_id === selectedLevel1Id
  );
  const [showLevel1Options, setShowLevel1Options] = useState<number | null>(
    null
  );
  const categorySubInfo = [
    { label: "ID danh mục cấp 1", value: selectedLevel1?.sub_category_id },
    { label: "Tên danh mục cấp 1", value: selectedLevel1?.sub_category_name },
    { label: "URL danh mục cấp 1", value: selectedLevel1?.sub_category_slug },
  ];

  return (
    <>
      <div className="font-semibold">Danh mục cấp 1</div>
      {selectedMain && (
        <div className="flex gap-6 mt-6">
          {/* Danh sách cấp 1 */}
          <div className="w-2/4 space-y-4">
            {selectedMain?.sub_category.length > 0 ? (
              selectedMain?.sub_category.map((l1: any) => (
                <div
                  key={l1?.sub_category_id}
                  onClick={() => {
                    const isSelected = selectedLevel1Id === l1?.sub_category_id;
                    setSelectedLevel1Id(
                      isSelected ? null : l1?.sub_category_id
                    );
                    setShowLevel1Options(
                      isSelected ? null : l1?.sub_category_id
                    );
                  }}
                  className={`relative cursor-pointer px-4 py-4 rounded-lg border ${
                    selectedLevel1Id === l1?.sub_category_id
                      ? "bg-[#F0F5FF] border-[#1E4DB7] font-semibold text-[#1E4DB7]"
                      : "hover:bg-gray-200 font-medium bg-gray-100 "
                  }`}
                >
                  <div className="flex space-x-2 mb-2">
                    <span>{l1?.sub_category_name}</span>
                    <div
                      className={`w-6 h-6 rounded-full font-semibold text-sm flex items-center justify-center ${
                        selectedLevel1Id === l1?.sub_category_id
                          ? "text-[#0053E2] bg-white"
                          : "text-gray-500 bg-white"
                      }`}
                    >
                      {l1?.child_category?.length}
                    </div>
                  </div>
                  <span
                    className={
                      "text-sm font-medium rounded-full bg-[#FFEAF4] p-2 text-[#FE7EB0]"
                    }
                  >
                    URL: {l1?.sub_category_slug}
                  </span>
                  {/* <div className="text-sm text-gray-500 font-normal">
                    URL: {l1?.sub_category_slug}
                  </div> */}

                  {showLevel1Options === l1?.sub_category_id && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Ngừng sự kiện click từ card
                          setDialogOpen(true);
                        }}
                        className="p-2 bg-[#DDF7E9] text-white rounded-full"
                      >
                        <MdOutlineModeEdit className="w-4 h-4 text-[#31B764]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Ngừng sự kiện click từ card
                          // handleDelete(categoryMain?.main_category_id);
                        }}
                        className="p-2 bg-[#FCECEC] text-white rounded-full"
                      >
                        <ImBin className="w-4 h-4 text-[#D4380D]" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Không có danh mục cấp 1.</p>
            )}
          </div>
          {selectedLevel1Id !== null && (
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="font-semibold">Danh mục cấp 2</div>
                {(selectedLevel1?.child_category?.length ?? 0) > 0 ? (
                  selectedLevel1?.child_category.map((lv2: any) => (
                    <div
                      key={lv2?.child_category_id}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div className="mb-2">
                        <h4 className="font-medium text-[#0053E2] mb-2">
                          {lv2?.child_category_name}
                        </h4>
                        <span
                          className={
                            "text-sm font-medium rounded-full bg-[#FAF1D7] p-2 text-[#F99D16]"
                          }
                        >
                          URL: {lv2?.child_category_slug}
                        </span>
                      </div>

                      <div className="flex gap-2 items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleEdit(lv2?.child_category_id);
                          }}
                          className="p-2 bg-[#DDF7E9] rounded-full"
                        >
                          <MdOutlineModeEdit className="w-4 h-4 text-[#31B764]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleDelete(lv2?.child_category_id);
                          }}
                          className="p-2 bg-[#FCECEC] rounded-full"
                        >
                          <ImBin className="w-4 h-4 text-[#D4380D]" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    Danh mục cấp 1 này chưa có danh mục cấp 2.
                  </p>
                )}
              </div>
            </div>
          )}
          {selectedLevel1Id === null && (
            <div className="flex-1 space-y-4">
              <p className="text-gray-500 text-sm">
                Vui lòng chọn danh mục cấp 1 để xem danh mục cấp 2.
              </p>
            </div>
          )}
        </div>
      )}
      {/* mở dialog  */}
      <UpdateSubCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        categorySubInfo={categorySubInfo}
        selectedSubId={selectedLevel1?.sub_category_id}
      />
    </>
  );
}
