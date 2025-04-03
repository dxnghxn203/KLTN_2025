import React, { use, useEffect } from "react";
import ProductsViewCard from "./productsViewedCard";
import { useProduct } from "@/hooks/useProduct";

const ProductsViewedList: React.FC = () => {

  const { productGetRecentlyViewed, fetchProductRecentlViewed} = useProduct();

  useEffect(() => {
    fetchProductRecentlViewed();
  }
  , []);
  
  return (
    <div className="w-full max-md:px-5 max-md:max-w-full mt-6">
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
          {productGetRecentlyViewed && productGetRecentlyViewed.map((product: any, index: any) => (
            <ProductsViewCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsViewedList;
