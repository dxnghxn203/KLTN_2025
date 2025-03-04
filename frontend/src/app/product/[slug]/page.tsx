"use client";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import ProductDetail from "@/components/Product/detailProduct";
import ProductsRelatedList from "@/components/Product/productsRelatedList";
import { useProduct } from "@/hooks/useProduct";
import React, { useEffect, useState } from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { getProductBySlug, productBySlug } = useProduct();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductBySlug(slug);
  }, [slug]);

  useEffect(() => {
    if (productBySlug) {
      setLoading(false);
    }
  }, [productBySlug]);

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col space-y-8 px-5 pt-16">
        {productBySlug ? (
          <>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              </div>
            ) : (
              <ProductDetail product={productBySlug} />
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-3xl font-bold text-red-500">
                Không tìm thấy sản phẩm
              </h2>
              <p className="text-lg text-gray-600">
                Xin lỗi, chúng tôi không thể tìm thấy sản phẩm bạn đang tìm
                kiếm.
              </p>
            </div>
          </>
        )}
      </main>
      <div className="self-start text-2xl font-extrabold text-black px-5 mt-6">
        Những sản phẩm liên quan
        <ProductsRelatedList />
      </div>
      <Footer />
    </div>
  );
}
