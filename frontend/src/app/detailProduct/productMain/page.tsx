"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import medicine1 from "@/images/medicinee.png";
import returnbox from "@/images/return-box.png";
import free from "@/images/free.png";
import fastdelivery from "@/images/fast-delivery.png";
import medi1 from "@/images/1.png";

const images = [
  medicine1,
  medi1,
  medicine1,
  medicine1,
  medi1,
  medi1,
  medi1,
  medi1,
];

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState("Hộp");
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="mx-auto bg-[#F5F7F9] px-5 rounded-lg">
      <div className="grid grid-cols-2 gap-6">
        {/* Hình ảnh sản phẩm */}
        <div className="flex flex-col items-center mt-12">
          <Image
            src={medicine1}
            alt=""
            width={400}
            height={400}
            className="object-contain cursor-pointer"
            priority
          />
          <div className="flex space-x-2">
            {images.slice(0, 3).map((src, index) => (
              <div
                key={index}
                className={`w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center ${
                  selectedImage === index
                    ? "border-[#002E99]"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={src}
                  alt={`Ảnh ${index + 1}`}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover px-2 py-2"
                />
              </div>
            ))}

            {/* Ảnh cuối có overlay hiển thị số lượng ảnh còn lại */}
            <div
              className="w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center relative cursor-pointer"
              onClick={() => setSelectedImage(3)}
            >
              <Image
                src={images[3]}
                alt="Ảnh cuối"
                width={112}
                height={112}
                className="w-full h-full object-cover px-2 py-2 opacity-40"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-center text-white text-sm font-medium px-4 z-0">
                Xem thêm {images.length - 4} ảnh
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="space-y-4">
          <h2 className="text-lg font-normal text-[#4A4F63] mt-4">
            Thương hiệu:
            <span className="text-[#0053E2] font-semibold"> Royal Care</span>
          </h2>
          <h1 className="text-3xl font-bold">
            Viên uống B Complex Vitamin Royal Care hỗ trợ giảm mệt mỏi, căng
            thẳng (60 viên)
          </h1>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <span>00032942</span>
            <span>•</span>
            <span>4.9</span>
            <span>★</span>
            <span>•</span>
            <a className="text-[#0053E2] hover:underline">32 đánh giá</a>
            <span>•</span>
            <a className="text-[#0053E2] hover:underline">332 bình luận</a>
          </div>

          <p className="text-[#0053E2] text-4xl font-bold mt-3 ">
            160.000đ/ Hộp
          </p>
          <p className="text-black/60 text-2xl font-semibold mt-3 line-through">
            160.000đ
          </p>
          <div className="flex items-center space-x-16">
            <p className="text-[#4A4F63] font-normal">Chọn đơn vị tính</p>
            <div className="flex space-x-2">
              {["Hộp", "Gói"].map((unit) => (
                <button
                  key={unit}
                  onClick={() => setSelected(unit)}
                  className={`flex items-center justify-center px-6 py-2 rounded-full border text-lg font-medium
          ${
            selected === unit
              ? "border-blue-500 text-black font-semibold"
              : "border-gray-300 text-gray-500"
          }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-stretch">
            {/* Cột 1: Tiêu đề */}
            <div className="flex flex-col justify-between text-[#4A4F63] font-normal">
              <div className="flex flex-col space-y-6 flex-1">
                <p>Danh mục</p>
                <p>Dạng bào chế</p>
                <p>Quy cách</p>
                <p>Xuất xứ thương hiệu</p>
                <p>Nhà sản xuất</p>
                <p>Thành phần</p>
                <p>Mô tả ngắn</p>
                <p>Danh mục</p>
                <p>Chọn số lượng</p>
              </div>
            </div>

            {/* Cột 2: Thông tin */}
            <div className="col-span-2 flex flex-col justify-between">
              <div className="flex flex-col space-y-6 flex-1">
                <p className="text-[#0053E2] font-semibold">Vitamin tổng hợp</p>
                <p>Viên nang cứng</p>
                <p>Hộp 60 Viên</p>
                <p>Việt Nam</p>
                <p>CÔNG TY CỔ PHẦN PHÁT TRIỂN DƯỢC VESTA</p>
                <p>
                  Vitamin B12, Vitamin B6, Vitamin B1, Vitamin PP, Vitamin C,
                  Magie oxide
                </p>
                <p>
                  B Complex Vitamin Royal Care hỗ trợ giảm các triệu chứng mệt
                  mỏi, căng thẳng, suy nhược thần kinh do thiếu magie, vitamin
                  B6.
                </p>
                <p>10481/2021/ÐKSP</p>
              </div>

              {/* Chọn số lượng */}
              <div className="flex items-center mt-2">
                <div className="flex items-center border rounded-lg">
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
            </div>
          </div>

          <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-full font-bold text-lg hover:bg-blue-800">
            Chọn mua
          </button>

          <p className="mt-2 flex items-center whitespace-nowrap text-sm">
            <span className="text-orange-500 font-bold flex items-center">
              ⚡Sản phẩm đang được chú ý,
            </span>
            <span className="text-black ml-1">
              có 7 người thêm vào giỏ hàng & 18 người đang xem
            </span>
          </p>

          <div className="mt-4 flex pb-4 font-medium items-center">
            <div className="flex items-center">
              <Image
                src={returnbox}
                alt=""
                width={30}
                height={30}
                className="mr-[4px]"
              />
              <div>
                <p>Đổi trả trong 30 ngày</p>
                <p className="text-[#4A4F63] font-normal">
                  kể từ ngày mua hàng
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Image
                src={free}
                alt=""
                width={30}
                height={30}
                className="mr-[4px]"
              />
              <div>
                <p>Miễn phí 100%</p>
                <p className="text-[#4A4F63] font-normal">đổi thuốc</p>
              </div>
            </div>
            <div className="flex items-center">
              <Image
                src={fastdelivery}
                alt=""
                width={30}
                height={30}
                className="mr-[4px]"
              />
              <div>
                <p>Miễn phí vận chuyển</p>
                <p className="text-[#4A4F63] font-normal">
                  theo chính sách giao hàng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
