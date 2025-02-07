'use client'
import { TrackingEvents } from '@/components/TrackingEvents'
import { useProduct } from '@/store/product/productHooks';
import { useEffect } from 'react';

export default function Home() {
  const { listProduct, loading, fetchListProduct } = useProduct();

  useEffect(() => {
    fetchListProduct();
  }, []);

  return (
    <main className="min-h-screen p-8">
      {
        listProduct.map((values: any) => 
          <h1 className="text-3xl font-bold mb-8" key={values?.key}>
            {values?.name}
          </h1>
        )
      }

      <TrackingEvents />
    </main>
  )
}
