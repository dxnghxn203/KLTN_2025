"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import returnbox from "@/images/return-box.png";
import free from "@/images/free.png";
import fastdelivery from "@/images/fast-delivery.png";
import { Category, Price, ProductImage } from "@/types/product";

interface DetailProductProps {
  product: {
    id: string;
    name: string;
    namePrimary: string;
    prices: Price[];
    slug: string;
    description: string;
    imagesPrimary: string;
    images: ProductImage[];
    category: Category;
  };
}

const DetailProduct = ({ product }: DetailProductProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(product.prices[0].unit);
  const [selectedImage, setSelectedImage] = useState(0);

  const selectedPrice =
    product.prices.find((price) => price.unit === selectedUnit) ||
    product.prices[0];

  return (
    <div className="mx-auto bg-[#F5F7F9] px-5 rounded-lg mt-16">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center mt-12">
          <div className="relative w-96 h-96 overflow-hidden">
            <div
              className="absolute inset-0 transition-transform duration-500"
              style={{ transform: `translateX(-${selectedImage * 100}%)` }}
            >
              <Image
                src={
                  selectedImage == 0
                    ? product.imagesPrimary
                    : product.images[selectedImage - 1].url
                }
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain cursor-pointer"
                priority
              />
            </div>
            {selectedImage > 0 && (
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
                onClick={() =>
                  setSelectedImage(
                    (selectedImage - 1 + product.images.length + 1) %
                      (product.images.length + 1)
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            {selectedImage < product.images.length && (
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
                onClick={() =>
                  setSelectedImage(
                    (selectedImage + 1) % (product.images.length + 1)
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="flex space-x-2 mt-4">
            <div
              className={`w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center ${
                selectedImage === 0 ? "border-[#002E99]" : "border-gray-300"
              }`}
              onClick={() => setSelectedImage(0)}
            >
              <Image
                src={product.imagesPrimary}
                alt={`Ảnh chính`}
                width={120}
                height={120}
                className="w-full h-full object-cover px-2 py-2"
              />
            </div>

            {product.images.slice(0, 2).map((img, index) => (
              <div
                key={img.id}
                className={`w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center ${
                  selectedImage === index + 1
                    ? "border-[#002E99]"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(index + 1)}
              >
                <Image
                  src={img.url}
                  alt={`Ảnh ${index + 1}`}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover px-2 py-2"
                />
              </div>
            ))}

            {/* More images indicator */}
            {product.images.length > 3 && (
              <div
                className="w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center relative cursor-pointer"
                onClick={() => setSelectedImage(3)}
              >
                <Image
                  src={product.images[2].url}
                  alt="Ảnh cuối"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover px-2 py-2 opacity-40"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-center text-white text-sm font-medium px-4 z-0">
                  Xem thêm {product.images.length - 3} ảnh
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product information */}
        <div className="space-y-4">
          <h2 className="text-lg font-normal text-[#4A4F63] mt-4">
            Thương hiệu:
            <span className="text-[#0053E2] font-semibold"> Royal Care</span>
          </h2>
          <h1 className="text-3xl font-bold">{product.namePrimary}</h1>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <span>{product.id}</span>
            <span>•</span>
            <span>4.9</span>
            <span>★</span>
            <span>•</span>
            <a className="text-[#0053E2] hover:underline">32 đánh giá</a>
            <span>•</span>
            <a className="text-[#0053E2] hover:underline">332 bình luận</a>
          </div>

          <p className="text-[#0053E2] text-4xl font-bold mt-3">
            {selectedPrice.price.toLocaleString("vi-VN")}đ/ {selectedPrice.unit}
          </p>
          {selectedPrice.originalPrice > selectedPrice.price && (
            <p className="text-black/60 text-2xl font-semibold mt-3 line-through">
              {selectedPrice.originalPrice.toLocaleString("vi-VN")}đ
            </p>
          )}

          <div className="flex items-center space-x-16">
            <p className="text-[#4A4F63] font-normal">Chọn đơn vị tính</p>
            <div className="flex space-x-2">
              {product.prices.map((price) => (
                <button
                  key={price.id}
                  onClick={() => setSelectedUnit(price.unit)}
                  className={`flex items-center justify-center px-6 py-2 rounded-full border text-lg font-medium
        ${
          selectedUnit === price.unit
            ? "border-blue-500 text-black font-semibold"
            : "border-gray-300 text-gray-500"
        }`}
                >
                  {price.unit}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-stretch">
            {/* Column 1: Titles */}
            <div className="flex flex-col justify-between text-[#4A4F63] font-normal">
              <div className="flex flex-col space-y-6 flex-1">
                <p>Danh mục</p>
                <p>Dạng bào chế</p>
                <p>Quy cách</p>
                <p>Xuất xứ thương hiệu</p>
                <p>Nhà sản xuất</p>
                <p>Mô tả ngắn</p>
                <p>Danh mục</p>
                <p>Chọn số lượng</p>
              </div>
            </div>

            {/* Column 2: Information */}
            <div className="col-span-2 flex flex-col justify-between">
              <div className="flex flex-col space-y-6 flex-1">
                <p className="text-[#0053E2] font-semibold">
                  {product.category.name}
                </p>
                <p>Viên nang cứng</p>
                <p>Hộp 10 Viên</p>
                <p>Việt Nam</p>
                <p>CÔNG TY CỔ PHẦN DƯỢC PHẨM MEBIPHAR</p>
                <p className="line-clamp-2">{product.description}</p>
                <p>{product.id}</p>
              </div>

              {/* Quantity selection */}
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

          {/* Footer benefits */}
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

export default DetailProduct;
