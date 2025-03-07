import React, { useState, useEffect } from "react";
import Image from "next/image";
import categories1 from "@/images/categories1.png";
import categories2 from "@/images/categories2.png";
import categories3 from "@/images/categories3.png";
import categories4 from "@/images/categories4.png";
import categories5 from "@/images/categories5.png";
import categories6 from "@/images/categories6.png";
import categories7 from "@/images/categories7.png";
import categories8 from "@/images/categories8.png";
import slider1 from "@/images/83.png";
import slider2 from "@/images/slider2.png";
import slider3 from "@/images/slider3.webp";
import slider from "@/images/slider.png";

const images = [slider1, slider2, slider3, slider];
console.log(images);

const ProductCatalog: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Chuyển slide tự động sau 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      title: "Sức khỏe sinh sản",
      description: "Hỗ trợ tình dục...",
      imageSrc: categories1,
      bgColor: "bg-red-100",
    },
    {
      title: "Dụng cụ y tế",
      description: "Gạc, Bông gòn, Cồn...",
      imageSrc: categories2,
      bgColor: "bg-cyan-100",
    },
    {
      title: "Dược mỹ phẩm",
      description: "Serum, Dưỡng trắng...",
      imageSrc: categories3,
      bgColor: "bg-orange-100",
    },
    {
      title: "Thuốc",
      description: "Da liễu, Dị ứng...",
      imageSrc: categories4,
      bgColor: "bg-lime-100",
    },
    {
      title: "Thực phẩm chức năng",
      description: "Hỗ trợ tăng cường...",
      imageSrc: categories5,
      bgColor: "bg-violet-200",
    },
    {
      title: "Chăm sóc cá nhân",
      description: "Xịt thơm miệng...",
      imageSrc: categories6,
      bgColor: "bg-blue-100",
    },
    {
      title: "Hỗ trợ giấc ngủ",
      description: "An thần, Ngủ ngon...",
      imageSrc: categories7,
      bgColor: "bg-amber-100",
    },
    {
      title: "Phong độ bền lâu",
      description: "Hỗ trợ sinh lý...",
      imageSrc: categories8,
      bgColor: "bg-orange-200",
    },
  ];

  return (
    <div className="pt-14 items-center">
      {/* Slider */}
      <div className="max-w-[1435px] h-full flex">
        {/* Ảnh lớn */}
        <div className="relative w-full max-w-[940px] overflow-hidden rounded-[14px]">
          <div className="flex">
            <div
              className="flex transition-transform duration-700 ease-in-out whitespace-nowrap"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => {
                // console.log(`Slide ${index}:`, image);
                return (
                  <div key={index} className="min-w-full">
                    <Image
                      src={image}
                      alt={`Slide ${index + 1}`}
                      width={940} // Đúng với max-width của slider
                      height={300} // Hoặc phù hợp với tỷ lệ
                      quality={100} // Tăng chất lượng
                      className="rounded-[14px] h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nút điều hướng */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Ảnh nhỏ */}
        <div className="flex flex-col space-y-4 w-[450px] pl-4">
          <div className="h-1/2">
            <Image
              src={slider2}
              alt=""
              // width={450}
              // height={140}
              className="rounded-[14px] h-full object-cover"
            />
          </div>
          <div className="h-1/2">
            <Image
              src={slider3}
              alt=""
              // width={450}
              // height={140}
              className="rounded-[14px] h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Danh mục sản phẩm */}
      <div className="mt-5 self-start text-2xl font-extrabold text-black">
        Danh mục sản phẩm
      </div>
      <div className="w-full max-md:px-5 max-md:max-w-full">
        <div className="self-center mt-5 w-full">
          <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`flex grow gap-5 justify-between items-start pt-4 pl-3.5 w-full text-black ${category.bgColor} rounded-xl max-md:mt-8`}
              >
                <div className="flex flex-col self-start">
                  <div className="text-base font-semibold">
                    {category.title}
                  </div>
                  <div className="self-start mt-3 text-sm">
                    {category.description}
                  </div>
                </div>
                <Image
                  src={category.imageSrc}
                  alt={category.title}
                  width={88}
                  height={88}
                  className="object-contain shrink-0 self-end mt-6 aspect-square"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
