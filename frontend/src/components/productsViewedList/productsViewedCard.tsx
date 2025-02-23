import React, { useState } from "react";
import { ProductData } from "./types";
import ProductDialog from "@/components/dialog/productDialog/productDialog";
import Image from "next/image";
import Link from "next/link";

const productsViewedCard: React.FC<ProductData> = ({
  discount,
  imageSrc,
  category,
  rating,
  name,
  price,
  originalPrice,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex text-xs font-bold whitespace-normal">
        <div className="flex flex-col rounded-3xl border border-neutral-100 bg-slate-100 min-w-[180px] w-[275px] relative ">
          {/* Ảnh sản phẩm */}
          <Link href="/detailProduct" legacyBehavior>
            <div className="relative p-6">
              <Image
                src={imageSrc}
                alt={name}
                width={204}
                height={204}
                className="object-contain cursor-pointer"
                priority
              />
              <div
                className={`absolute top-8 right-0 bg-amber-300 text-black text-sm font-medium px-3 py-1 rounded-l-lg rounded-bl-lg shadow-md cursor-pointer ${
                  discount ? "" : "invisible"
                }`}
              >
                {discount || "Ưu đãi"}
              </div>
            </div>
          </Link>

          {/* Thông tin sản phẩm */}
          <div className="px-5 py-4 bg-white rounded-3xl border border-neutral-100">
            {/* Category + Rating */}
            <div className="flex justify-between text-xs mb-5">
              <span className="font-normal text-[#A7A8B0]">{category}</span>
              <div className="flex items-center gap-2.5">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/3fb1e163c165fc6375e283b0be8b64e20b1e971291ae656171dc64b8ec27a93e?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
                  className="object-contain w-3.5 aspect-square"
                  alt=""
                />
                <span className="font-normal text-[#A7A8B0]">({rating})</span>
              </div>
            </div>

            {/* Tên sản phẩm */}
            <div className="mt-2 text-[16px] font-semibold text-black line-clamp-2 break-words leading-[1.5]">
              {name}
            </div>

            {/* Giá sản phẩm */}
            <div className="mt-2">
              <div
                className={`text-sm text-neutral-300 line-through ${
                  originalPrice ? "" : "invisible"
                }`}
              >
                {originalPrice || "Giá gốc"}
              </div>
              <div className="text-lg font-bold text-[#0053E2]">{price}</div>
            </div>

            {/* Nút chọn sản phẩm */}
            <div className="mt-2 flex justify-center">
              <button
                className="px-14 py-3.5 text-sm text-white bg-blue-700 rounded-3xl"
                onClick={() => setIsDialogOpen(true)} // Mở dialog khi nhấn
              >
                + Chọn sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog hiển thị khi isDialogOpen = true */}
      {isDialogOpen && (
        <ProductDialog
          name={name}
          price={price}
          discount={discount ?? ""}
          originalPrice={originalPrice ?? ""}
          imageSrc={imageSrc}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default productsViewedCard;
