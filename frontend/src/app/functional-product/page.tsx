"use client";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import Image from "next/image";
import { useState } from "react";

// Import các hình ảnh
import tpcn from "@/images/tpcn.png";
import ProductPortfolioList from "@/components/Product/productPortfolioList";
import ProductsViewedList from "@/components/Product/productsViewedList";

// Mảng chứa dữ liệu sản phẩm
const productData = [
  { image: tpcn, title: "Dành cho trẻ em" },
  { image: tpcn, title: "Dành cho người lớn" },
  { image: tpcn, title: "Bổ sung vitamin" },
  { image: tpcn, title: "Hỗ trợ tiêu hóa" },
  { image: tpcn, title: "Tăng cường miễn dịch" },
  { image: tpcn, title: "Chăm sóc xương khớp" },
  { image: tpcn, title: "Hỗ trợ tim mạch" },
  { image: tpcn, title: "Thải độc cơ thể" },
  { image: tpcn, title: "Thải độc cơ thể" },
  { image: tpcn, title: "Thải độc cơ thể" },
  { image: tpcn, title: "Thải độc cơ thể" },
  { image: tpcn, title: "Thải độc cơ thể" },
];

export default function FunctionalProduct() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRange, setSelectedRange] = useState("");
  const priceRanges = [
    { label: "Dưới 100.000 đ", value: "under-100" },
    { label: "100.000 đ - 300.000 đ", value: "100-300" },
    { label: "300.000 đ - 500.000 đ", value: "300-500" },
    { label: "Trên 500.000 đ", value: "above-500" },
  ];
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-2">
          Trang chủ/ Thực phẩm chức năng
        </div>
        <div className="text-2xl font-bold py-4 px-6">Thuốc</div>

        {/* Hiển thị danh sách sản phẩm */}
        <div className="flex justify-start gap-6 flex-wrap px-5">
          {productData.map((product, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="rounded-full bg-[#EAEFFA] w-[130px] h-[130px] flex items-center justify-center">
                <Image
                  src={product.image}
                  alt="icon"
                  width={120}
                  height={120}
                />
              </div>
              <span className="mt-2 w-[130px] text-center">
                {product.title}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div className="pl-5 space-y-4">
            <div className="flex pt-12 space-x-6">
              <span className="font-semibold">Bộ lọc</span>
              <span className="text-[#0053E2]">Thiết lập lại</span>
            </div>
            <div className="border-b border-gray-300"></div>
            <form className="">
              <span className="font-semibold">Khoảng giá</span>
              <div className="flex flex-col gap-2 py-2">
                <input
                  type="text"
                  placeholder="Tối thiểu"
                  // value={minPrice}
                  // onChange={(e) => setMinPrice(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Tối đa"
                  // value={maxPrice}
                  // onChange={(e) => setMaxPrice(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-sm"
                />
                <button className="bg-[#0053E2] text-white font-semibold py-2 rounded-lg">
                  Áp dụng
                </button>
              </div>
            </form>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label
                  key={range.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="price-range"
                    value={range.value}
                    checked={selectedRange === range.value}
                    onChange={() => setSelectedRange(range.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="col-span-5 mr-5 pt-[38px] space-y-6">
            <div className="flex space-x-4 items-center">
              <span className="">Sắp xếp theo</span>
              <button className="px-6 py-2 border border-gray-300 text-black/50 rounded-lg text-semibold ">
                Giá tăng dần
              </button>
              <button className="px-6 py-2 border border-gray-300 text-black/50 rounded-lg text-semibold ">
                Giá giảm dần
              </button>
            </div>
            <ProductPortfolioList />
          </div>
        </div>
      </main>
      <div className="text-2xl font-extrabold text-black px-5 pt-10">
        Sản phẩm vừa xem
      </div>
      <div className="px-5">
        <ProductsViewedList />
      </div>

      <Footer />
    </div>
  );
}
