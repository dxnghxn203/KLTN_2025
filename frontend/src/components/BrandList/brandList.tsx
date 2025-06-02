import React, { useEffect } from "react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { useBrand } from "@/hooks/useBrand";

interface BrandProps {
  name: string;
  logo: string;
}

const BrandItem: React.FC<BrandProps> = ({ name, logo }) => (
  <div className="flex flex-col justify-center items-center w-full max-md:w-1/2 max-lg:w-1/3">
    <Link
      href={`/thuong-hieu/${encodeURIComponent(name)}`}
      className="flex flex-col "
    >
      <div className="flex flex-col justify-center items-center px-7 rounded-full bg-neutral-100 h-[170px] w-[170px] max-md:px-5 ">
        <img
          loading="lazy"
          src={logo}
          alt={`${name} logo`}
          className="object-contain w-28 aspect-[1.12]"
        />
      </div>
      <div className="self-center mt-1.5 text-lg font-semibold text-black">
        {name}
      </div>
    </Link>
  </div>
);

const BrandList: React.FC = () => {
  const { getAllBrandsUser, fetchGetAllBrandUser } = useBrand();
  useEffect(() => {
    fetchGetAllBrandUser(
      () => {},
      () => {}
    );
  }, []);
  return (
    getAllBrandsUser.length > 0 && (
      <div className="flex flex-col w-full max-md:px-5 max-md:max-w-full">
        <Link href="/thuong-hieu">
          <div className="px-6 flex flex-wrap gap-5 justify-between items-start w-full text-black max-md:max-w-full">
            <div className="flex gap-2 text-sm font-semibold ml-auto items-center mt-[-30px]">
              <div>Xem tất cả</div>
              <FaArrowRightLong />
            </div>
          </div>
        </Link>

        <div className="flex gap-5 justify-around items-center py-0.5 mt-7 w-full max-md:flex-wrap md:g">
          {getAllBrandsUser &&
            getAllBrandsUser
              .slice(0, 6)
              .map((brand: any, index: any) => (
                <BrandItem key={index} {...brand} />
              ))}
        </div>
      </div>
    )
  );
};

export default BrandList;
