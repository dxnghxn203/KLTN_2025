"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mx-auto bg-[#F5F7F9] px-6 rounded-lg">
      <div className="grid grid-cols-2 gap-6">
        {/* Hình ảnh sản phẩm */}
        <div>
          <img
            src="/product-image.png"
            alt="B Complex Vitamin"
            className="w-full rounded-lg"
          />
          <div className="flex mt-3 space-x-2">
            <img src="/thumb1.png" alt="thumb" className="w-20 h-20 border" />
            <img src="/thumb2.png" alt="thumb" className="w-20 h-20 border" />
            <img src="/thumb3.png" alt="thumb" className="w-20 h-20 border" />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            Thương hiệu:{" "}
            <span className="text-black font-bold">Royal Care</span>
          </h2>
          <h1 className="text-2xl font-bold mt-2">
            Viên uống B Complex Vitamin Royal Care hỗ trợ giảm mệt mỏi, căng
            thẳng (60 viên)
          </h1>
          <p className="text-red-600 text-2xl font-bold mt-3">160.000đ/ Hộp</p>

          <div className="mt-4">
            <p className="text-gray-600">
              Chọn đơn vị tính: <span className="font-bold">Hộp</span>
            </p>
          </div>

          <div className="mt-4">
            <p className="text-gray-600">
              Danh mục: <span className="text-blue-600">Vitamin tổng hợp</span>
            </p>
            <p className="text-gray-600">Dạng bào chế: Viên nang cứng</p>
            <p className="text-gray-600">Quy cách: Hộp 60 Viên</p>
            <p className="text-gray-600">Xuất xứ thương hiệu: Việt Nam</p>
            <p className="text-gray-600">
              Nhà sản xuất: CÔNG TY CỔ PHẦN PHÁT TRIỂN DƯỢC VESTA
            </p>
          </div>

          <div className="mt-4">
            <p className="text-gray-600">
              Thành phần:{" "}
              <span className="text-blue-600">
                Vitamin B12, Vitamin B6, Vitamin B1, Vitamin PP, Vitamin C,
                Magie oxide
              </span>
            </p>
          </div>

          <div className="mt-4">
            <p className="text-gray-600">
              Mô tả ngắn: B Complex Vitamin Royal Care hỗ trợ giảm các triệu
              chứng mệt mỏi, căng thẳng, suy nhược thần kinh do thiếu magie,
              vitamin B6.
            </p>
          </div>

          <div className="mt-4 flex items-center">
            <p className="text-gray-600">Chọn số lượng:</p>
            <div className="flex items-center ml-3 border rounded-lg">
              <button
                className="px-3 py-2"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-3 py-2"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800">
            Chọn mua
          </button>

          <p className="text-red-500 mt-2">
            Sản phẩm đang được chú ý, có 7 người thêm vào giỏ hàng & 18 người
            đang xem
          </p>

          <div className="mt-4 flex space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">
                🔄 Đổi trả trong 30 ngày
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">
                🚚 Miễn phí 100% đổi trả
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">
                🚛 Miễn phí vận chuyển
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
