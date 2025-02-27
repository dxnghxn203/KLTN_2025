import React from "react";
import ProductCard from "./productCard";
import { ProductData } from "./types";
import medicine1 from "@/images/medicinee.png";

const productData: ProductData[] = [
  {
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Găng tay dùng một lần Salon World Safety Blue Nitrile.",
    price: 150000,
    unit: "Chai",
    originalPrice: 180000,
  },
  {
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 190000,
    unit: "Chai",
  },
  {
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originalPrice: 180000,
  },
  {
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 150000,
    unit: "Chai",
    originalPrice: 180000,
  },
];

const ProductList: React.FC = () => {
  return (
    <div className="w-full max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between items-start w-full text-black mt-[-30px]">
        <div className="flex gap-4 text-sm font-semibold ml-auto items-center">
          <div>Tất cả sản phẩm</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/4282386e8e10e4cd937088581f41e88c0447a42f0fbef58faf3983032326b5ce?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
            alt="Arrow right"
            className="object-contain aspect-[1.42]"
          />
        </div>
      </div>
      <div className="self-center mt-5 w-full max-md:max-w-full">
        <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1">
          {productData.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
