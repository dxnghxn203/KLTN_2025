import React from "react";

interface BrandProps {
  name: string;
  imageSrc: string;
}

const brands: BrandProps[] = [
  {
    name: "GSK",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/2e50ce3d3878c1a7a5924e1ee230f642db70e97a85004a65d23973b1c750a871?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
  {
    name: "AstraZeneca",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/482073e37028d6471ad2696ca264aa39fc0b77272823735e06081c77ceeff11f?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
  {
    name: "Novartis",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/42e8a06f0d16fd2827af327b551b28c4cea98593443899548a29beb2afdcd186?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
  {
    name: "Johnson & Johnson",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/561ef42c8dcf1c28a40bf84e33cb7cd7363efcda29d9f449ef1ed6765809abc6?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
  {
    name: "Merck",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/cd7fa8b715939ee2f409bef2482a33c5d1774425efcf96b9b900684d5b260f2b?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
  {
    name: "Pfizer",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/754ea8e0e4e24af05c6847d63bc3f42c74fcbfa9d56f463adb9593e088177fa4?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
];

const BrandItem: React.FC<BrandProps> = ({ name, imageSrc }) => (
  <div className="flex flex-col">
    <div className="flex flex-col justify-center items-center px-7 rounded-full bg-neutral-100 h-[170px] w-[170px] max-md:px-5">
      <img
        loading="lazy"
        src={imageSrc}
        alt={`${name} logo`}
        className="object-contain w-28 aspect-[1.12]"
      />
    </div>
    <div className="self-center mt-1.5 text-xl font-bold text-black">
      {name}
    </div>
  </div>
);

const BrandList: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-md:px-5 max-md:max-w-full">
      <div className="px-6 flex flex-wrap gap-5 justify-between items-start w-full text-black max-md:max-w-full">
        {/* "Xem tất cả" nằm bên phải */}
        <div className="flex gap-2 text-sm font-semibold ml-auto items-center mt-[-30px]">
          <div>Xem tất cả</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/4282386e8e10e4cd937088581f41e88c0447a42f0fbef58faf3983032326b5ce?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
            alt="Arrow right"
            className="object-contain w-[17px] aspect-[1.42]"
          />
        </div>
      </div>

      <div className="flex gap-5 justify-around items-center py-0.5 mt-7 w-full max-md:flex-wrap">
        {brands.map((brand, index) => (
          <BrandItem key={index} {...brand} />
        ))}
      </div>
    </div>
  );
};

export default BrandList;
