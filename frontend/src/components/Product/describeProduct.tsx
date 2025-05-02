import { GoAlertFill } from "react-icons/go";
import { useState } from "react";
import DOMPurify from "dompurify";

const SafeHtmlDisplay = ({ htmlContent }: { htmlContent: string }) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent); // Lọc HTML an toàn

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: cleanHtml }} // Render nội dung HTML an toàn
    />
  );
};
const DescribeProduct = ({ product }: { product: any }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#F5F7F9] rounded-lg p-5 space-y-4">
      {/* Mô tả sản phẩm */}
      <div className="space-y-2">
        <div className="text-xl font-bold">Mô tả sản phẩm</div>
        <SafeHtmlDisplay htmlContent={product?.full_descriptions || ""} />
      </div>

      {/* Thành phần */}
      <div className="space-y-2">
        <div className="text-xl font-bold">Thành phần</div>
        <div className="overflow-hidden rounded-lg border border-gray-300 w-[80%]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="text-left p-3 font-semibold">
                  Thông tin thành phần
                </th>
                <th className="text-left p-3 font-semibold">Hàm lượng</th>
              </tr>
            </thead>
            <tbody>
              {product?.ingredients.map((item: any, index: any) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-t`}
                >
                  <td className="p-3">{item.ingredient_name}</td>
                  <td className="p-3">{item.ingredient_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Công dụng */}
      <div className="space-y-2">
        <div className="text-xl font-bold">Công dụng</div>
        <SafeHtmlDisplay htmlContent={product?.uses || ""} />
      </div>

      {/* Cách dùng */}
      <div className="space-y-2">
        <div className="text-xl font-bold">Cách dùng</div>
        <SafeHtmlDisplay htmlContent={product?.dosage || ""} />
      </div>

      {/* Nội dung ẩn */}
      {expanded && (
        <>
          {/* Tác dụng phụ */}
          <div className="space-y-2">
            <div className="text-xl font-bold">Tác dụng phụ</div>
            <SafeHtmlDisplay htmlContent={product?.side_effects || ""} />
            <div className="bg-[#FFF3E1] rounded-lg px-4 py-4 space-y-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 text-[#FFC048] font-semibold text-xl">
                  <GoAlertFill />
                  <span>Lưu ý</span>
                </div>

                <SafeHtmlDisplay htmlContent={product?.precautions || ""} />
              </div>
            </div>
          </div>

          {/* Bảo quản */}
          <div className="space-y-2">
            <div className="text-xl font-bold">Bảo quản</div>
            <SafeHtmlDisplay htmlContent={product?.storage || ""} />
          </div>
        </>
      )}

      {/* Nút mở rộng */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mx-auto flex justify-center text-[#002E99] font-semibold mt-4"
      >
        {expanded ? "Thu gọn" : "Xem thêm"}
      </button>
    </div>
  );
};

export default DescribeProduct;
