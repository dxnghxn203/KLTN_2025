"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import returnbox from "@/images/return-box.png";
import free from "@/images/free.png";
import fastdelivery from "@/images/fast-delivery.png";
import {
  Category,
  Price,
  ProductImage,
  Manufacturer,
  Ingredient,
} from "@/types/product";
import DescribeProduct from "./describeProduct";
import Guide from "./guide";
import FeedBack from "./feedBack";

interface DetailProductProps {
  product: {
    product_id: string;
    product_name: string;
    name_primary: string;
    prices: Price[];
    slug: string;
    description: string;
    images_primary: string;
    images: ProductImage[];
    category: Category;
    dosage_form: string;
    origin: string;
    manufacturer: Manufacturer;
    ingredients: Ingredient[];
  };
}

const DetailProduct = ({ product }: DetailProductProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(product?.prices[0]?.unit);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  const selectedPrice =
    product?.prices.find((price) => price.unit === selectedUnit) ||
    product?.prices[0];

  return (
    <div className="space-y-12 ">
      <div className="mx-auto bg-[#F5F7F9] px-5 rounded-lg">
        <div className="flex gap-10">
          <div className="w-[40%] flex flex-col items-center mt-12">
            <div className="relative w-full h-[400px] flex items-center justify-center">
              <div className="w-96 h-96">
                <Image
                  src={
                    selectedImage === 0
                      ? product?.images_primary
                      : product?.images[selectedImage - 1]?.images_url
                  }
                  alt={""}
                  width={390}
                  height={390}
                  className="object-contain cursor-pointer"
                  priority
                />
              </div>
              {selectedImage > 0 && (
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
                  onClick={() =>
                    setSelectedImage(
                      (selectedImage - 1 + product?.images.length + 1) %
                        (product?.images.length + 1)
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
              {selectedImage < product?.images.length && (
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
                  onClick={() =>
                    setSelectedImage(
                      (selectedImage + 1) % (product?.images.length + 1)
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

            <div className="flex w-full justify-between mt-8 gap-2">
              <div
                className={`w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center ${
                  selectedImage === 0 ? "border-[#002E99]" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(0)}
              >
                <Image
                  src={product?.images_primary}
                  alt={`Ảnh chính`}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover px-2 py-2"
                />
              </div>

              {product?.images.slice(0, 2).map((img, index) => (
                <div
                  key={img?.images_id}
                  className={`w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center ${
                    selectedImage === index + 1
                      ? "border-[#002E99]"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(index + 1)}
                >
                  <Image
                    src={img?.images_url}
                    alt={`Ảnh ${index + 1}`}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover px-2 py-2"
                  />
                </div>
              ))}

              {/* More images indicator */}
              {product?.images.length > 3 && (
                <div
                  className="w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center relative cursor-pointer"
                  onClick={() => setSelectedImage(3)}
                >
                  <Image
                    src={product?.images[2]?.images_url}
                    alt="Ảnh cuối"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover px-2 py-2 opacity-40"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-center text-white text-sm font-medium px-4 z-0">
                    Xem thêm {product?.images.length - 3} ảnh
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Product details */}
          <div className="space-y-4 ml-4 w-[60%]">
            <h2 className="text-lg font-normal text-[#4A4F63] mt-4">
              Thương hiệu:
              <span className="text-[#0053E2] font-semibold"> Royal Care</span>
            </h2>
            <h1 className="text-3xl font-bold">{product?.name_primary}</h1>
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <span>{product?.product_id}</span>
              <span>•</span>
              <span>4.9</span>
              <span>★</span>
              <span>•</span>
              <a className="text-[#0053E2] hover:underline">32 đánh giá</a>
              <span>•</span>
              <a className="text-[#0053E2] hover:underline">332 bình luận</a>
            </div>

            <p className="text-[#0053E2] text-4xl font-bold mt-3">
              {selectedPrice.price.toLocaleString("vi-VN")}đ/{" "}
              {selectedPrice.unit}
            </p>
            {selectedPrice.originalPrice > selectedPrice.price && (
              <p className="text-black/60 text-2xl font-semibold mt-3 line-through">
                {selectedPrice.originalPrice.toLocaleString("vi-VN")}đ
              </p>
            )}

            <div className="flex items-center space-x-16">
              <p className="text-[#4A4F63] font-normal">Chọn đơn vị tính</p>
              <div className="flex space-x-2">
                {product?.prices.map((price) => (
                  <button
                    key={price.id}
                    onClick={() => setSelectedUnit(price.unit)}
                    className={`flex items-center justify-center px-6 py-2 rounded-full border text-lg font-normal
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
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <tbody>
                  {/* Danh mục */}
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">Danh mục</td>
                    <td className="pl-0 py-3 w-2/3 text-[#0053E2] font-semibold">
                      {product?.category?.name}
                    </td>
                  </tr>
                  {/* Dạng bào chế */}
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                      Dạng bào chế
                    </td>
                    <td className="pl-0 py-3 w-2/3">{product?.dosage_form}</td>
                  </tr>
                  {/* Quy cách */}
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">Quy cách</td>
                    <td className="pl-0 py-3 w-2/3">
                      {product?.prices[0]?.amount_per_unit}
                    </td>
                  </tr>
                  {/* Xuất xứ thương hiệu */}
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                      Xuất xứ thương hiệu
                    </td>
                    <td className="pl-0 py-3 w-2/3">{product?.origin}</td>
                  </tr>
                  {/* Nhà sản xuất */}
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                      Nhà sản xuất
                    </td>
                    <td className="pl-0 py-3 w-2/3">
                      {product?.manufacturer?.manufacture_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                      Nước sản xuất
                    </td>
                    <td className="pl-0 py-3 w-2/3">
                      {product?.manufacturer?.manufacture_address}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                      Thành phần
                    </td>
                    <td className="pl-0 py-3 w-2/3">
                      {product?.ingredients?.map(
                        (ingredient: any, index: number) => (
                          <span key={index}>
                            {ingredient.ingredient_name.match(
                              /Vitamin\s\w+/i
                            ) ? (
                              <span className="text-blue-600">
                                {ingredient.ingredient_name}
                              </span>
                            ) : (
                              ingredient.ingredient_name
                            )}
                            {index < product.ingredients.length - 1 && ", "}
                          </span>
                        )
                      )}
                    </td>
                  </tr>
                  {/* Mô tả ngắn */}
                  <tr>
                    <td className="pr-4 pt-4 pb-6 w-1/3 text-[#4A4F63]">
                      Mô tả ngắn
                    </td>
                    <td className="pt-4 mb-6 line-clamp-2">
                      {product?.description}
                    </td>
                  </tr>
                  {/* Chọn số lượng */}
                  <tr>
                    <td className="pr-4 py-4 w-1/3 text-[#4A4F63]">
                      Chọn số lượng
                    </td>
                    <td className="pl-0 py-4 w-2/3">
                      <div className="flex items-center">
                        <div className="flex items-center border rounded-lg">
                          <button
                            className="px-3 py-2"
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button className="mt-6 w-full bg-blue-700 text-white py-3 rounded-full font-bold text-lg hover:bg-blue-800">
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
            <div className="mt-4 flex pb-4 font-medium items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image
                  src={returnbox}
                  alt=""
                  width={30}
                  height={30}
                  className="mr-[4px]"
                />
                <div className="text-[14px]">
                  <p>Đổi trả trong 30 ngày</p>
                  <p className="text-[#4A4F63] font-normal">
                    kể từ ngày mua hàng
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  src={free}
                  alt=""
                  width={30}
                  height={30}
                  className="mr-[4px]"
                />
                <div className="text-[14px] ">
                  <p>Miễn phí 100%</p>
                  <p className="text-[#4A4F63] font-normal">đổi thuốc</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  src={fastdelivery}
                  alt=""
                  width={30}
                  height={30}
                  className="mr-[4px]"
                />
                <div className="text-[14px]">
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
      <div className="mx-auto rounded-lg">
        {/* Tab Bar */}
        <div className="flex">
          {[
            { id: "details", label: "Chi tiết sản phẩm" },
            { id: "guide", label: "Hướng dẫn mua hàng" },
            { id: "reviews", label: "Đánh giá và Hỏi đáp" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`py-3 px-6 text-white text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-blue-800" : "bg-[#313B41]"
              } ${tab.id !== "reviews" ? "border-r border-gray-600" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Nội dung Tab */}
        <div className="">
          {activeTab === "details" && <DescribeProduct product={product} />}
          {activeTab === "guide" && <Guide />}
          {activeTab === "reviews" && <FeedBack />}
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
