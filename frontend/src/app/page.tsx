"use client";
import { useProduct } from "@/store/product/productHooks";
import { useEffect } from "react";
import LoginPage from "./login/LoginPage";

export default function Home() {
  const { listProduct, loading, fetchListProduct } = useProduct();

  useEffect(() => {
    fetchListProduct();
  }, []);

  return (
    <div>
      <LoginPage />
    </div>
  );
}
