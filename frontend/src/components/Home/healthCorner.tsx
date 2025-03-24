import React from "react";
import Image from "next/image";
import Link from "next/link";
import yoga from "@/images/yoga.webp";
import tranhthai from "@/images/tranhthai.webp";
import diengiai from "@/images/diengiai.webp";

interface ArticleProps {
  imageUrl: any;
  title: string;
  description: string;
  slug: string;
}

const articles: ArticleProps[] = [
  {
    slug: "loi-ich-tap-yoga",
    imageUrl: yoga,
    title: "Lợi ích của tập yoga là gì? Tìm hiểu các trường phái phổ biến",
    description:
      "Yoga không chỉ giúp thư giãn mà còn cải thiện sức khỏe đáng kể. Hãy cùng tìm hiểu lợi ích của yoga và các trường phái phổ biến hiện nay.",
  },
  {
    slug: "que-tranh-thai",
    imageUrl: tranhthai,
    title: "Que tránh thai là gì? Cấy que tránh thai bao lâu thì có hiệu quả?",
    description:
      "Que tránh thai là phương pháp phổ biến giúp chị em kiểm soát sinh sản hiệu quả. Cùng khám phá cách hoạt động và hiệu quả của phương pháp này.",
  },
  {
    slug: "mat-nuoc-va-chat-dien-giai",
    imageUrl: diengiai,
    title:
      "Cần bổ sung gì khi bị mất nước và chất điện giải để đảm bảo sức khỏe?",
    description:
      "Mất nước và chất điện giải có thể gây ảnh hưởng nghiêm trọng đến sức khỏe. Vậy bạn cần bổ sung gì để bảo vệ cơ thể?",
  },
];

const HealthCorner: React.FC = () => {
  return (
    <div className="flex flex-col px-6 mt-10 w-full max-md:px-5 max-md:max-w-full">
      <div className="self-start text-2xl font-extrabold text-black">
        Góc sức khỏe
      </div>
      <div className="grid grid-cols-3 gap-8 mt-6 w-full max-md:grid-cols-1 max-md:gap-7">
        {articles.map((article) => (
          <Link href={`/health-corner/${article.slug}`}>
            <div className="flex flex-col cursor-pointer">
              <div className="w-full rounded-2xl overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={300}
                  height={180}
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
              <div className="self-start mt-5 text-sm font-semibold line-clamp-1">
                {article.title}
              </div>
              <div className="mt-2.5 text-xs text-gray-600 line-clamp-3">
                {article.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HealthCorner;
