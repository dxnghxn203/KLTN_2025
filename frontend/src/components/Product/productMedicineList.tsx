import React, { useState } from "react";
import ProductPortfolioCard from "./productFunctionalCard";
import { ProductData } from "@/types/product";
import medicine1 from "@/images/medicinee.png";
import { generateRandomId } from "@/utils/string";
import Filter from "@/components/Category/filter";
import shopping from "@/images/shopping.png";
import Image from "next/image";
import ProductMedicineCard from "./productMedicineCard";

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
    price: 210000,
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
    price: 80000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 80000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 80000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 80000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 80000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 80000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
  {
    id: generateRandomId(),
    imageSrc: medicine1,
    category: "Dinh dưỡng",
    rating: 4.5,
    name: "Sản phẩm sức khỏe bổ sung chế độ ăn uống...",
    price: 80000,
    unit: "Chai",
    brand: "Stella Pharm",
  },
];

const ProductMedicineList: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  // Hàm sắp xếp sản phẩm theo giá
  const sortedProducts = [...productData].sort((a, b) => {
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
  const sortedAndFilteredProducts = [...productData]
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

      <div className="col-span-5 mr-5 pt-[38px] space-y-6">
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
          {sortedAndFilteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-5 gap-4 max-md:grid-cols-1">
                {sortedAndFilteredProducts.map((product, index) => (
                  <ProductMedicineCard key={index} {...product} />
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
};

export default ProductMedicineList;
