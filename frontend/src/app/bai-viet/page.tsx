import DinhDuongNews from "@/components/Article/nutrition";
import mainImage from "@/images/22.webp";
import Image from "next/image";
import Link from "next/link";
import { SlUmbrella } from "react-icons/sl";
const ArticleMain = () => {
  const articles = [
    {
      title:
        "FPT Long Châu lên tiếng về thông tin sai lệch liên quan sản phẩm Happy Mom",
      excerpt:
        "FPT Long Châu chính thức phản hồi về thông tin sai lệch liên quan đến sản phẩm Happy Mom...",
      image: "/images/happy-mom.jpg",
      date: "15/04/2025",
      slug: "cach-tra-cuu-thong-tin-dang-ky-thuoc",
    },
    {
      title:
        "Giải pháp điều trị mỡ máu tiên tiến hàng đầu thế giới đã có mặt tại Việt Nam",
      excerpt:
        "FPT Long Châu giới thiệu giải pháp điều trị mỡ máu thế hệ mới...",
      image: "/images/mo-mau.jpg",
      date: "10/04/2025",
    },
    {
      title: "Tọa đàm chuyên môn với chuyên gia dinh dưỡng hàng đầu",
      excerpt:
        "Sự kiện tọa đàm giúp nâng cao hiểu biết về dinh dưỡng cho cộng đồng...",
      image: "/images/toa-dam.jpg",
      date: "05/04/2025",
    },
    {
      title: "Tọa đàm chuyên môn với chuyên gia dinh dưỡng hàng đầu",
      excerpt:
        "Sự kiện tọa đàm giúp nâng cao hiểu biết về dinh dưỡng cho cộng đồng...",
      image: "/images/toa-dam.jpg",
      date: "05/04/2025",
    },
    {
      title: "Tọa đàm chuyên môn với chuyên gia dinh dưỡng hàng đầu",
      excerpt:
        "Sự kiện tọa đàm giúp nâng cao hiểu biết về dinh dưỡng cho cộng đồng...",
      image: "/images/toa-dam.jpg",
      date: "05/04/2025",
    },
    {
      title: "Tọa đàm chuyên môn với chuyên gia dinh dưỡng hàng đầu",
      excerpt:
        "Sự kiện tọa đàm giúp nâng cao hiểu biết về dinh dưỡng cho cộng đồng...",
      image: "/images/toa-dam.jpg",
      date: "05/04/2025",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-[135px] px-5 ">
      <div className="text-sm text-[#0053E2] ">
        <Link href="/" className="hover:underline text-blue-600">
          Trang chủ
        </Link>
        <span className="text-gray-500">/ Góc sức khỏe / Truyền thông</span>
      </div>
      <h1 className="text-3xl font-bold mb-6 py-4">Góc sức khỏe</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
        {/* Bài viết chính */}
        <Link
          href={`/goc-suc-khoe/truyen-thong/${articles[0].slug}`}
          className="col-span-1 lg:col-span-3"
        >
          <div className="col-span-2 overflow-hidden">
            <Image
              src={mainImage}
              alt={articles[0].title}
              className="w-full object-cover"
            />
            <div className="p-4">
              <div className="p-2 my-2 text-xs rounded-full bg-gray-100 text-gray-700 font-medium w-fit">
                Truyền thông
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {articles[0].title}
              </h2>
              <p className="text-gray-600">{articles[0].excerpt}</p>
            </div>
          </div>
        </Link>

        {/* Các bài viết phụ */}
        <div className="lg:col-span-2 space-y-4">
          {articles.slice(0, 6).map((article, index) => (
            <div key={index} className="flex space-x-4">
              <div className="flex items-center justify-center">
                <Image
                  src={mainImage}
                  alt={article.title}
                  width={250}
                  height={250}
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="">
                <div className="text-xs py-1 px-2 rounded-full bg-gray-100 text-gray-700 font-medium w-fit mb-1">
                  Truyền thông
                </div>
                <h2 className="text-sm font-semibold">{article.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DinhDuongNews />
    </div>
  );
};

export default ArticleMain;
