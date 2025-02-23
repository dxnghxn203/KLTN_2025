import React from "react";
import ProductCard from "./productsViewedCard";
import { ProductData } from "./types";
import medicine1 from "@/images/medicinee.png";

const productData: ProductData[] = [
  {
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Găng tay dùng một lần Salon World Safety Blue Nitrile.",
    price: "150.000đ/Chai",
    originalPrice: "180.000đ",
  },
  {
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: "190.000đ/Chai",
  },
  {
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: "150.000đ/Chai",
    originalPrice: "180.000đ",
  },
  {
    discount: "-20%",
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: "150.000đ/Chai",
    originalPrice: "180.000đ",
  },
];

const ProductsViewedList: React.FC = () => {
  return (
    <div className="px-6 w-full max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between items-start w-full text-black max-md:max-w-full mt-[-30px]">
        <div className="flex gap-2 text-sm font-semibold ml-auto items-center">
          <div>Tất cả sản phẩm</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/4282386e8e10e4cd937088581f41e88c0447a42f0fbef58faf3983032326b5ce?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
            alt="Arrow right"
            className="object-contain w-[17px] aspect-[1.42]"
          />
        </div>
      </div>
      <div className="self-center mt-5 w-full max-w-[1170px] max-md:max-w-full">
        <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1">
          {productData.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsViewedList;
