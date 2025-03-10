"use client";
import { useParams } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import Link from "next/link";
import Filter from "@/components/Category/filter";
import ProductPortfolioList from "@/components/Product/productPortfolioList";
const BrandDetail = () => {
  const { brandName, brandImage, brandDescription } = useParams() as {
    brandName: string;
    brandImage: string;
    brandDescription: string;
  };

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        <div className="px-5 text-sm text-[#0053E2]">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link href="/brand" className="hover:underline text-blue-600">
            Thương hiệu
          </Link>
          <span className="text-gray-800"> / </span>
          <Link href="/collection/products-selling" className="text-gray-800">
            {brandName}
          </Link>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <Filter />
          <div className="col-span-5 mr-5 pt-[38px] space-y-6">
            <div className="flex bg-white p-5 rounded-xl shadow-md border border-gray-200 items-center">
              <div className="w-[400px] flex justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/42e8a06f0d16fd2827af327b551b28c4cea98593443899548a29beb2afdcd186?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
                  alt=""
                  className="object-cover h-auto max-w-full"
                />
              </div>
              <div className="ml-10 space-y-2">
                <h3 className="text-xl font-bold">{brandName}</h3>
                <p>
                  "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên
                  nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và
                  dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực
                  dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương
                  châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống -
                  toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn
                  tuổi."
                </p>
              </div>
            </div>

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
      <Footer />
    </div>
  );
};

export default BrandDetail;
