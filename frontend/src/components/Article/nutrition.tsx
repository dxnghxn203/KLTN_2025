// pages/DinhDuongNews.js

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

export default function DinhDuongNews() {
  return (
    <main className={`text-gray-800 min-h-screen py-6 ${inter.className}`}>
      {/* Header nav */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <nav className="flex flex-wrap items-center space-x-4 text-sm sm:text-base">
          <a href="#" className="font-semibold text-blue-600">
            Dinh dưỡng
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            Ăn ngon khỏe
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            Thực phẩm dinh dưỡng
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            Chế độ ăn kiêng
          </a>
        </nav>
        <a
          href="#"
          className="text-blue-600 text-sm sm:text-base flex items-center space-x-1"
        >
          <span>Xem tất cả</span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>
      </div>

      {/* Main content grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
          {/* Left big image */}
          <div className="rounded-md">
            <img
              src="https://storage.googleapis.com/a1aa/image/ae8b1995-c9b6-432f-b758-3fd1580e9758.jpg"
              alt="A bowl of colorful salad with quinoa, cherry tomatoes, avocado slices, black beans, and onions on a wooden table with a green napkin and fork"
              className="object-cover rounded-md"
              width={300}
            />
          </div>
          {/* Two articles on right */}
          <div className="flex flex-col flex-grow space-y-4 h-full">
            <article className="bg-gray-100 rounded-md p-3 h-full">
              <span className="inline-block bg-gray-300 text-gray-700 text-xs rounded-full px-3 py-1 mb-1 select-none">
                Dinh dưỡng
              </span>
              <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1">
                Trình tự bữa ăn thế nào tốt cho người tiểu đường?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                Người tiểu đường không chỉ cần quan tâm đến ăn gì mà còn cần chú
                ý đến cách ăn như thế nào cho đúng. Bởi trình tự bữa ăn có thể
                ảnh hưởng trực...
              </p>
            </article>
            <article className="bg-gray-100 rounded-md p-3 h-full">
              <span className="inline-block bg-gray-300 text-gray-700 text-xs rounded-full px-3 py-1 mb-1 select-none">
                Dinh dưỡng
              </span>
              <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1">
                Hiểu đúng hơn về mối quan hệ giữa protein và axit uric
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                Là một thành phần dinh dưỡng không thể thiếu, protein tham gia
                sâu vào quá trình xây dựng và duy trì các mô trong cơ thể. Trong
                khi đó, axit uric được tạo ra khi c...
              </p>
            </article>
          </div>
        </div>

        {/* Bottom row with 3 articles */}
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
          <article className="flex-grow bg-white rounded-md p-3 border border-transparent hover:border-gray-200">
            <span className="inline-block bg-gray-300 text-gray-700 text-xs rounded-full px-3 py-1 mb-1 select-none">
              Dinh dưỡng
            </span>
            <h3 className="font-semibold text-gray-900 text-base leading-snug">
              Nghiên cứu cho thấy cà phê đen cải thiện độ nhạy insulin ở phụ nữ
            </h3>
          </article>
          <article className="flex-grow bg-white rounded-md p-3 border border-transparent hover:border-gray-200">
            <span className="inline-block bg-gray-300 text-gray-700 text-xs rounded-full px-3 py-1 mb-1 select-none">
              Dinh dưỡng
            </span>
            <h3 className="font-semibold text-gray-900 text-base leading-snug">
              Vì sao ăn quả bơ giúp cải thiện sức khỏe tim mạch?
            </h3>
          </article>
          <article className="flex-grow bg-white rounded-md p-3 border border-transparent hover:border-gray-200">
            <span className="inline-block bg-gray-300 text-gray-700 text-xs rounded-full px-3 py-1 mb-1 select-none">
              Ăn ngon khỏe
            </span>
            <h3 className="font-semibold text-gray-900 text-base leading-snug">
              7+ món ăn vặt không gây tăng đường huyết
            </h3>
          </article>
        </div>
      </div>
    </main>
  );
}
