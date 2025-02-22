import React from "react";
import Image, { StaticImageData } from "next/image";

// Import hình ảnh
import categories1 from "@/images/categories1.png";
import categories2 from "@/images/categories2.png";
import categories3 from "@/images/categories3.png";
import categories4 from "@/images/categories4.png";
import categories5 from "@/images/categories5.png";
import categories6 from "@/images/categories6.png";
import categories7 from "@/images/categories7.png";
import categories8 from "@/images/categories8.png";
import imageslider1 from "@/images/imageslider1.webp";

interface CategoryItemProps {
  title: string;
  description: string;
  imageSrc: StaticImageData | string;
  bgColor: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  title,
  description,
  imageSrc,
  bgColor,
}) => (
  <div
    className={`flex grow gap-5 justify-between items-start pt-4 pl-3.5 w-full text-black ${bgColor} rounded-xl max-md:mt-8`}
  >
    <div className="flex flex-col self-start">
      <div className="text-base font-semibold">{title}</div>
      <div className="self-start mt-3 text-sm">{description}</div>
    </div>
    {typeof imageSrc === "string" ? (
      <img
        loading="lazy"
        src={imageSrc}
        alt={title}
        className="object-contain shrink-0 self-end mt-6 aspect-square w-[88px]"
      />
    ) : (
      <Image
        loading="lazy"
        src={imageSrc}
        alt={title}
        width={88}
        height={88}
        className="object-contain shrink-0 self-end mt-6 aspect-square"
      />
    )}
  </div>
);

const ProductCatalog: React.FC = () => {
  const categories = [
    {
      title: "Sức khỏe sinh sản",
      description: "Hỗ trợ tình dục...",
      imageSrc: categories1,
      bgColor: "bg-red-100",
    },
    {
      title: "Dụng cụ y tế",
      description: "Gạc, Bông gòn, Cồn, Dung dịch sát khuẩn,...",
      imageSrc: categories2,
      bgColor: "bg-cyan-100",
    },
    {
      title: "Dược mỹ phẩm",
      description: "Serum, Dưỡng trắng, Trị mụn,...",
      imageSrc: categories3,
      bgColor: "bg-orange-100",
    },
    {
      title: "Thuốc",
      description: "Da liễu, Dị ứng, Tiêu hoá,...",
      imageSrc: categories4,
      bgColor: "bg-lime-100",
    },
    {
      title: "Thực phẩm chức năng",
      description: "Hỗ trợ tăng cường, Bổ sung dưỡng chất,...",
      imageSrc: categories5,
      bgColor: "bg-violet-200",
    },
    {
      title: "Chăm sóc cá nhân",
      description: "Xịt thơm miệng, Lăn xịt khử mùi, Wax tẩy lông,...",
      imageSrc: categories6,
      bgColor: "bg-blue-100",
    },
    {
      title: "Hỗ trợ giấc ngủ",
      description: "An thần, Ngủ ngon, ...",
      imageSrc: categories7,
      bgColor: "bg-amber-100",
    },
    {
      title: "Phong độ bền lâu",
      description: "Hỗ trợ sinh lý,...",
      imageSrc: categories8,
      bgColor: "bg-orange-200",
    },
  ];

  return (
    <div className="pt-14">
      <Image
        loading="lazy"
        src={imageslider1}
        alt=""
        width={1435}
        height={480}
        className="w-full r max-md:max-w-full rounded-[14px]"
      />
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/40d3bd69b5c1319cd09b7fc8d171a2ce53237e3b1d6833c0c39c9bef6e710c81?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
        alt=""
        className="object-contain self-end mt-0 w-0 rounded-2xl max-md:mt-0"
      />

      <div className="mt-5 self-start text-2xl font-extrabold text-black">
        Danh mục sản phẩm
      </div>
      <div className="px-6 w-full max-md:px-5 max-md:max-w-full">
        <div className="self-center mt-5 w-full max-w-[1170px] max-md:max-w-full">
          <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1">
            {categories.map((category, index) => (
              <CategoryItem key={index} {...category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
