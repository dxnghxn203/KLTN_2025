import React from "react";
import Image from "next/image";
import yoga from "@/images/yoga.webp";
import tranhthai from "@/images/tranhthai.webp";
import diengiai from "@/images/diengiai.webp";

interface ArticleProps {
  imageUrl: any;
  title: string;
  description: string;
}

const Article: React.FC<ArticleProps> = ({ imageUrl, title, description }) => {
  return (
    <div className="flex flex-col grow text-black max-md:mt-7">
      <div className="w-full rounded-2xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          width={300} // Tuỳ chỉnh theo kích thước mong muốn
          height={180} // Tuỳ chỉnh theo kích thước mong muốn
          className="w-full h-auto rounded-2xl object-cover"
        />
      </div>

      <div className="self-start mt-5 text-sm font-semibold line-clamp-1">
        {title}
      </div>
      <div className="mt-2.5 text-xs text-gray-600 line-clamp-3">
        {description}
      </div>
    </div>
  );
};

const HealthCorner: React.FC = () => {
  const articles = [
    {
      imageUrl: yoga,
      title:
        "Lợi ích của tập yoga là gì? Tìm hiểu các trường phái phổ biến trong yoga để có lựa chọn phù hợp...biến trong yoga để có lựa chọn phù hợp...",
      description:
        "Trong cuộc sống hiện đại ngày nay, ngoài các lựa chọn các hoạt động vui chơi giải trí, mọi người cũng có xu hướng lựa chọn các hoạt động vừa giúp thư giãn, vừa cải thiện sức khỏe, điển hình là yoga...",
    },
    {
      imageUrl: tranhthai,
      title:
        "Que tránh thai là gì? Cấy que tránh thai bao lâu thì có hiệu quả?",
      description:
        "Cấy que tránh thai bao nhiêu tiền là câu hỏi được rất nhiều chị em phụ nữ quan tâm vì đây là một biện pháp tránh thai an toàn và thông dụng ở Việt Nam...",
    },
    {
      imageUrl: diengiai,
      title:
        "Cần bổ sung gì khi bị mất nước và chất điện giải để đảm bảo sức khỏe?",
      description:
        "Cơ thể bị mất nước và chất điện giải có khả năng gây ra những vấn đề về sức khỏe rất đáng lo ngại. Vì vậy, bạn cần phải hiểu biết về những loại thực phẩm có thể bổ sung...",
    },
  ];

  return (
    <div className="flex flex-col px-6 mt-9 w-full max-md:px-5 max-md:max-w-full">
      <div className="self-start text-2xl font-extrabold text-black">
        Góc sức khỏe
      </div>
      <div className="grid grid-cols-3 gap-8 mt-6 w-full max-md:grid-cols-1 max-md:gap-7">
        {articles.map((article, index) => (
          <div key={index} className="flex flex-col">
            <Article {...article} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthCorner;
