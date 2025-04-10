'use client';
import React, { useState } from "react";
import ProductDialog from "@/components/Dialog/productDialog";
import Image from "next/image";
import Link from "next/link";
import { ProductData } from "@/types/product";

const ProductCard = ({ product }: { product: any }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {
        product && (
          <div className="flex text-xs font-bold whitespace-normal">
            <div className="flex flex-col rounded-3xl border border-neutral-100 bg-slate-100 min-w-[100px] w-full">
              <Link href={`/chi-tiet-san-pham/${product?.slug}`} legacyBehavior>
                <div className="py-6 flex flex-col items-center">
                  <div className="flex justify-end w-full">
                    {product?.prices[0]?.discount !== undefined && product?.prices[0]?.discount !== 0 ? (
                      <div className="bg-amber-300 text-black text-sm font-medium px-3 py-1 rounded-l-lg rounded-bl-lg shadow-md transition-opacity">
                        {product?.prices[0]?.discount} %
                      </div>
                    ) : (
                      <div className="bg-amber-300 text-black text-sm font-medium px-3 py-1 rounded-l-lg rounded-bl-lg shadow-md opacity-0">
                        Ưu đãi
                      </div>
                    )}
                  </div>
                  <Image
                    src={product?.images_primary}
                    alt={product?.product_id}
                    width={170}
                    height={170}
                    className="object-contain cursor-pointer"
                    priority
                  />
                </div>
              </Link>

              <div className="px-3 py-4 bg-white rounded-3xl border border-neutral-100">
                <div className="flex justify-between text-xs mb-5">
                  <span className="font-normal text-[#A7A8B0]">{product?.category?.main_category_name}</span>
                  <div className="flex items-center gap-2.5">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/3fb1e163c165fc6375e283b0be8b64e20b1e971291ae656171dc64b8ec27a93e?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
                      className="object-contain w-3.5 aspect-square"
                      alt=""
                    />
                    <span className="font-normal text-[#A7A8B0]">(3)</span>
                  </div>
                </div>

                <div className="mt-2 text-[16px] font-semibold text-black line-clamp-2 break-words leading-[1.5] h-[48px]">
                  {product?.product_name}
                </div>

                <div className="mt-2">
                  {product?.prices[0] ? (
                    <div className="text-sm text-zinc-400 line-through">
                      {product?.prices[0]?.original_price.toLocaleString("vi-VN")}đ
                    </div>
                  ) : (
                    <div className="text-sm opacity-0">Giá gốc</div>
                  )}
                  <div className="text-lg font-bold text-[#0053E2]">
                    {product?.prices[0]?.price.toLocaleString("vi-VN")}đ/{product?.prices[0]?.unit}
                  </div>
                </div>

                <div className="mt-2 flex justify-center">
                  <button
                    className="w-full py-3.5 text-sm text-white bg-blue-700 rounded-3xl"
                    onClick={() => setIsDialogOpen(true)} // Mở dialog khi nhấn
                  >
                    + Chọn sản phẩm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }


      {isDialogOpen && (
        <ProductDialog
          product={product}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
