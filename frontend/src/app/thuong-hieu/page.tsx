"use client";
import React from "react";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import Link from "next/link";
import { StaticImageData } from "next/image";
interface BrandProps {
  name: string;
  imageSrc: string;
  description: string;
}
const brands: BrandProps[] = [
  {
    name: "GSK",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/2e50ce3d3878c1a7a5924e1ee230f642db70e97a85004a65d23973b1c750a871?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
  },
  {
    name: "AstraZeneca",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/482073e37028d6471ad2696ca264aa39fc0b77272823735e06081c77ceeff11f?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
  },
  {
    name: "Novartis",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/42e8a06f0d16fd2827af327b551b28c4cea98593443899548a29beb2afdcd186?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Johnson & Johnson",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/561ef42c8dcf1c28a40bf84e33cb7cd7363efcda29d9f449ef1ed6765809abc6?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Merck",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/cd7fa8b715939ee2f409bef2482a33c5d1774425efcf96b9b900684d5b260f2b?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Pfizer",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/754ea8e0e4e24af05c6847d63bc3f42c74fcbfa9d56f463adb9593e088177fa4?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Sanofi",
    imageSrc:
      "https://prod-cdn.pharmacity.io/e-com/images/product/20240703034117-0-Sanofi%20CHC.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Goodhealth",
    imageSrc:
      "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-core/brand-images/16_Goodhealth.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Pharmacist Formulators",
    imageSrc:
      "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-core/brand-images/PF_1.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "82X",
    imageSrc:
      "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-core/brand-images/82X.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Abbott",
    imageSrc:
      "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-core/brand-images/4_Abbott.jpg",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Pediasure",
    imageSrc:
      "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-core/brand-images/13_Pediasure.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Rohto",
    imageSrc:
      "https://prod-cdn.pharmacity.io/e-com/images/ecommerce/20240617082307-0-Rohto.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Shinpoong",
    imageSrc:
      "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-core/brand-images/Shinpoong.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Tracybee",
    imageSrc:
      "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-core/brand-images/40_Tracybee.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Imexpharm",
    imageSrc:
      "https://prod-cdn.pharmacity.io/e-com/images/ecommerce/20240728015834-0-Imexpharm.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Sanofi CHC",
    imageSrc:
      "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-core/brand-images/3_Sanofi_CHC.png",
  },
  {
    description:
      "Abbott là công ty chăm sóc sức khỏe hàng đầu thế giới, chuyên nghiên cứu, phát triển, sản xuất và đưa ra các sản phẩm và dịch vụ chăm sóc sức khỏe có chất lượng cao trong lĩnh vực dinh dưỡng, dược phẩm, thiết bị chẩn đoán và điều trị. Phương châm toàn diện của các sản phẩm Abbott là phục vụ cuộc sống – toàn tâm với nhu cầu chăm sóc sức khỏe từ trẻ em đến người lớn tuổi.",
    name: "Henry Blooms",
    imageSrc:
      "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-core/brand-images/Henry_Blooms.png",
  },
];

const BrandItem: React.FC<BrandProps> = ({ name, imageSrc }) => (
  <Link
    href={`/thuong-hieu/${encodeURIComponent(name)}`}
    className="flex flex-col"
  >
    <div className="flex flex-col justify-center items-center px-7 rounded-full bg-neutral-100 h-[170px] w-[170px] max-md:px-5">
      <img
        loading="lazy"
        src={imageSrc}
        alt={`${name} logo`}
        className="object-contain w-28 aspect-[1.12]"
      />
    </div>
    <div className="self-center mt-1.5 text-lg font-semibold text-black">
      {name}
    </div>
  </Link>
);

const BrandList: React.FC = () => {
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col pt-14 mb-10">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link href="/BrandList/products-selling" className="text-gray-800">
            Thương hiệu
          </Link>
          <div className="self-start text-2xl font-extrabold text-black py-4">
            Thương hiệu
          </div>

          <div className="grid grid-cols-6 gap-5 justify-items-center py-0.5 w-full max-md:grid-cols-3 max-sm:grid-cols-2">
            {brands.map((brand, index) => (
              <BrandItem key={index} {...brand} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandList;
