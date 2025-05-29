"use client";
import ProductDetail from "@/components/Product/detailProduct";
import ProductsRelatedList from "@/components/Product/productsRelatedList";
import {useProduct} from "@/hooks/useProduct";
import React, {use, useEffect, useMemo, useState} from "react";
import Link from "next/link";
import Loading from "@/app/loading";

export default function ProductPage({params}: { params: { slug: string } }) {
    const {slug} = params;
    const {fetchProductBySlug, productBySlug} = useProduct();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        fetchProductBySlug(
            slug,
            () => {
                setLoading(false);
            },
            () => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
            {loading ? (
                <Loading/>
            ) : (
                <main className="flex flex-col px-5 pt-14 ">
                    <div className="text-sm text-[#0053E2] pb-5">
                        <Link href="/" className="hover:underline text-blue-600">
                            Trang chủ
                        </Link>
                        <span> / </span>
                        <Link
                            href={`/${productBySlug?.category?.main_category_slug}`}
                            className="hover:underline text-blue-600"
                        >
                            {productBySlug?.category?.main_category_name}
                        </Link>
                        <span> / </span>
                        <Link
                            href={`/${productBySlug?.category?.main_category_slug}/${productBySlug?.category?.sub_category_slug}`}
                            className="hover:underline text-blue-600"
                        >
                            {productBySlug?.category?.sub_category_name}
                        </Link>
                        <span className="text-gray-500"> / </span>
                        <span className="text-sm text-gray-500">
              {productBySlug?.category?.child_category_name}
            </span>
                    </div>
                    {productBySlug ? (
                        <>
                            <ProductDetail product={productBySlug}/>
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
            )}

            <div className="self-start text-2xl font-extrabold text-black px-5 mt-6">
                {productBySlug && (
                    <>
                        Những sản phẩm liên quan
                        <ProductsRelatedList product={productBySlug}/>
                    </>
                )}
            </div>
        </div>
    );
}
