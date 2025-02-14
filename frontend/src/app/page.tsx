'use client'
import { useProduct } from '@/store/product/productHooks';
import { useEffect } from 'react';

export default function Home() {
  const { listProduct, loading, fetchListProduct } = useProduct();

  useEffect(() => {
    fetchListProduct();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Trang chủ</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : (<div>          {/* Add your home page content here */}        </div>)}    </div>);
}