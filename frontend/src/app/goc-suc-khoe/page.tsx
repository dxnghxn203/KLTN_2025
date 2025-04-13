import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
}

const articles: Article[] = [
  {
    slug: "loi-ich-tap-yoga",
    title: "Lợi ích của tập yoga là gì?",
    description:
      "Tìm hiểu các trường phái phổ biến trong yoga để có lựa chọn phù hợp.",
    content: "Nội dung chi tiết bài viết về yoga...",
  },
  {
    slug: "que-tranh-thai",
    title: "Que tránh thai là gì?",
    description: "Cấy que tránh thai bao lâu thì có hiệu quả?",
    content: "Nội dung chi tiết bài viết về que tránh thai...",
  },
];

export default function AllArticlesPage() {
  return (
    <div className="min-h-screen bg-white pt-[80px] pb-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        Danh sách bài viết
      </h1>
      <div className="max-w-3xl mx-auto space-y-8">
        {articles.map((article) => (
          <div
            key={article.slug}
            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              {article.title}
            </h2>
            <p className="text-gray-600 mt-2">{article.description}</p>
            <Link
              href={`/bai-viet/${article.slug}`}
              className="text-blue-500 mt-4 inline-block hover:underline"
            >
              Đọc thêm →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
