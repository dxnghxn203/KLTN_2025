import { notFound } from "next/navigation";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
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

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) return notFound();

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col space-y-8 px-5 justify-center items-center">
        <div className="px-6 py-10">
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <p className="text-gray-500 mt-2">{article.description}</p>
          <div className="mt-4 text-lg">{article.content}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
