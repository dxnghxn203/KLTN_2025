"use client";
import CategoryList from "@/components/Admin/Category/categoryList";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const Category = () => {
  const router = useRouter();
  const { admin } = useAuth();

  useEffect(() => {
    if (!admin) {
      router.push("/dang-nhap-admin");
    }
  }, [admin, router]);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-black">Danh mục</h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <span> / </span>
        <Link href="/product/product-management" className="text-gray-800">
          Danh mục
        </Link>
      </div>
      <CategoryList />
    </div>
  );
};

export default Category;
