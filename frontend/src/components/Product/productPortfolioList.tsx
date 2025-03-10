import React, { useState } from "react";
import ProductCard from "./productCard";
import { ProductData } from "@/types/product";
import medicine1 from "@/images/medicinee.png";
import { generateRandomId } from "@/utils/string";
import ProductPortfolioCard from "./productPortfolioCard";

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

    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 19000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 190000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 190000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 190000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
];

const ProductPortfolioList: React.FC = () => {
  const [showAll, setShowAll] = useState(false); // Trạng thái hiển thị tất cả

  // Số lượng sản phẩm hiển thị tùy vào trạng thái
  const displayedProducts = showAll ? productData : productData.slice(0, 10);
  return (
    <div className="w-full max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between items-start w-full text-black mt-[-30px]"></div>
      <div className="self-center mt-5 w-full max-md:max-w-full">
        <div className="grid grid-cols-5 gap-4 max-md:grid-cols-1">
          {displayedProducts.map((product, index) => (
            <ProductPortfolioCard key={index} {...product} />
          ))}
        </div>
      </div>
      <div className="text-center mt-5">
        <button
          className="px-6 py-2 border border-[#0053E2] text-[#0053E2] rounded-lg transition"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>
    </div>
  );
};

export default ProductPortfolioList;
