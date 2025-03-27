import React, { useState } from "react";
import ProductPortfolioCard from "./productMainCategoryCard";
import { ProductData } from "@/types/product";
import medicine1 from "@/images/medicinee.png";
import { generateRandomId } from "@/utils/string";
import Filter from "@/components/Category/filter";
import shopping from "@/images/shopping.png";
import Image from "next/image";
import ProductPersonalCareCard from "./productChildCategoryCard";
import ProductChildCategoryCard from "./productChildCategoryCard";
import { useParams } from "next/navigation";

export default function ProductChildCategoryList({
  data,
  mainCategoryName,
}: {
  data: { childCategory: string; products: any };
  mainCategoryName: string;
}) {
  const params = useParams();
  const childCategory =
    data.childCategory ||
    (Array.isArray(params.childCategory)
      ? params.childCategory[0]
      : params.childCategory);
  const products = data.products || [];
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  // Hàm sắp xếp sản phẩm theo giá
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  const displayedProducts = showAll
    ? sortedProducts
    : sortedProducts.slice(0, 10);

  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({
    min: 0,
    max: Infinity,
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Lọc sản phẩm theo giá và thương hiệu
  const sortedAndFilteredProducts = [...products]
    .filter(
      (product) =>
        product.price >= priceFilter.min &&
        product.price <= priceFilter.max &&
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand))
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="grid grid-cols-6 gap-4">
      <Filter
        onPriceFilterChange={setPriceFilter}
        onBrandFilterChange={setSelectedBrands}
      />

      <div className="col-span-5 mr-5 space-y-6">
        <div className="flex space-x-4 items-center">
          <span className="">Sắp xếp theo</span>
          <button
            className={`px-6 py-2 border rounded-lg text-semibold ${
              sortOrder === "asc"
                ? "border-blue-600 text-blue-600"
                : "border-gray-300 text-black/50"
            }`}
            onClick={() => setSortOrder("asc")}
          >
            Giá tăng dần
          </button>
          <button
            className={`px-6 py-2 border rounded-lg text-semibold ${
              sortOrder === "desc"
                ? "border-blue-600 text-blue-600"
                : "border-gray-300 text-black/50"
            }`}
            onClick={() => setSortOrder("desc")}
          >
            Giá giảm dần
          </button>
        </div>
        <div className="w-full max-md:px-5 max-md:max-w-full">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-5 gap-4 max-md:grid-cols-1">
                {products.map((productData: any, index: any) => (
                  <ProductChildCategoryCard
                    key={index}
                    childCategory={childCategory}
                    products={productData}
                    mainCategoryName={mainCategoryName}
                  />
                ))}
              </div>
              {showAll && (
                <div className="text-center mt-5">
                  <button
                    className="px-6 py-2 border border-[#0053E2] text-[#0053E2] rounded-lg transition"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Thu gọn" : "Xem thêm"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 py-10">
              <Image
                src={shopping}
                alt="No products"
                width={150}
                height={150}
              />
              <p className="mt-2">Không có sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
