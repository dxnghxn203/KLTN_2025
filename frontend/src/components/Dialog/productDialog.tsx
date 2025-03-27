"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
// import "react-toastify/dist/ReactToastify.css";

interface ProductDialogProps {
  name: string;
  price: number;
  discount: number;
  originPrice: number;
  imageSrc: StaticImageData;
  unit: string;
  id: string;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  name,
  price,
  discount,
  originPrice,
  imageSrc,
  unit,
  id,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      name,
      price,
      discount,
      originPrice,
      imageSrc,
      unit,
      quantity,
      id,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <div className="text-left text-2xl font-semibold text-black">
          Chọn sản phẩm
        </div>

        <div className="flex gap-6 py-4">
          <div className="w-1/2 flex justify-center items-center bg-[#F1F5F9] p-4 rounded-lg ">
            <Image
              src={imageSrc}
              alt="Product"
              width={250}
              height={250}
              className="object-contain w-full max-w-[250px]"
              priority
            />
          </div>

          <div className="w-1/2 text-left">
            <h1 className="text-2xl font-semibold text-black">{name}</h1>
            <div className="flex gap-2 mt-3">
              {discount !== 0 && (
                <span className="px-2 py-2 text-xs font-medium text-black bg-amber-300 rounded-lg flex items-center justify-center">
                  {discount}%
                </span>
              )}
              {originPrice != null && originPrice !== 0 && (
                <span className="text-xl font-bold text-zinc-400 line-through flex items-center justify-center">
                  {originPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>

            <div className="mt-2 text-4xl font-bold text-blue-700">
              {price.toLocaleString("vi-VN")}đ/{unit}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="font-semibold">Số lượng:</span>

              <div className="flex items-center gap-2 border p-2 rounded-lg">
                <button
                  className={`px-3 py-1  rounded-md ${
                    quantity === 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  −
                </button>

                <span className="text-lg font-medium">{quantity}</span>

                <button
                  className="px-3 py-1  rounded-md hover:bg-gray-300"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>
            <Link
              href="/thanh-toan"
              className="block mt-10 bg-[#0053E2] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#002E99] w-full text-center"
            >
              Mua ngay
            </Link>

            <button
              onClick={handleAddToCart}
              className="mt-3 text-[#0053E2] font-semibold px-6 py-3 rounded-xl w-full border border-[#0053E2] hover:border-opacity-50 hover:text-opacity-50"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDialog;
