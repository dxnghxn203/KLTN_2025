"use client";
import React, { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/Product/productCard";
import { ProductData } from "@/types/product";
import ProductPortfolioList from "@/components/Product/productFunctionalList";
import medicine1 from "@/images/medicinee.png";
import { generateRandomId } from "@/utils/string";
import ProductDealsList from "../Product/productDealsList";
import ProductDealsCard from "../Product/productDealsCard";
const productData: ProductData[] = [
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Găng tay dùng một lần Salon World Safety Blue Nitrile.",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 190000,
    unit: "Chai",
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
  {
    id: generateRandomId(),
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originPrice: 180000,
    brand: "Alfe",
  },
];
const ProductsDeals: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedProducts = showAll ? productData : productData.slice(0, 12);

  return (
    <div className="text-sm text-[#0053E2] px-5">
      <Link href="/" className="hover:underline text-blue-600">
        Trang chủ
      </Link>
      <span> / </span>
      <Link href="/collection/products-selling" className="text-gray-800">
        Deals tốt nhất dành cho bạn
      </Link>
      <div className="self-start text-2xl font-extrabold text-black py-4">
        Deals tốt nhất dành cho bạn
      </div>
      <div className="col-span-5 mr-5 space-y-6">
        <div className="flex space-x-4 items-center">
          <span className="text-black/50">Sắp xếp theo</span>
          <button className="px-6 py-2 border border-gray-300 text-black/50 rounded-lg text-semibold ">
            Giá tăng dần
          </button>
          <button className="px-6 py-2 border border-gray-300 text-black/50 rounded-lg text-semibold ">
            Giá giảm dần
          </button>
        </div>
      </div>
      <div className="self-center mt-5 w-full max-md:max-w-full">
        <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1">
          {displayedProducts.map((product, index) => (
            <ProductDealsCard key={index} {...product} />
          ))}
        </div>
      </div>
      {displayedProducts.length < productData.length && (
        <div className="text-center mt-6">
          <button
            className="px-12 py-2 border border-[#0053E2] text-[#0053E2] text-lg rounded-lg transition"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsDeals;
