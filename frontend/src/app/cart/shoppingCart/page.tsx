import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ImBin } from "react-icons/im";
import OrderSummary from "./orderSumary";
import medicine from "@/images/medicinee.png";
import Image, { StaticImageData } from "next/image";
import DeleteProductDialog from "@/components/dialog/deleteDialog/deleteProductDialog";

interface Product {
  id: number;
  name: string;
  image: string | StaticImageData;
  price: number;
  originPrice: number;
  quantity: number;
  unit: string;
}

const unitOptions = ["Cái", "Hộp", "Chai", "Gói"];

const productsData: Product[] = [
  {
    id: 1,
    name: "Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo ",
    image: medicine,
    price: 100000,
    originPrice: 300000,
    quantity: 1,
    unit: "Cái",
  },
  {
    id: 2,
    name: "Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo ",
    image: medicine,
    price: 100000,
    originPrice: 300000,
    quantity: 1,
    unit: "Cái",
  },
  {
    id: 3,
    name: "Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo ",
    image: medicine,
    price: 100000,
    originPrice: 300000,
    quantity: 1,
    unit: "Cái",
  },
  {
    id: 4,
    name: "Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo ",
    image: medicine,
    price: 100000,
    originPrice: 300000,
    quantity: 1,
    unit: "Cái",
  },
];

const ShoppingCart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const totalAmount = useMemo(() => {
    return products
      .filter((product) => selectedProducts.includes(product.id))
      .reduce((total, product) => total + product.price * product.quantity, 0);
  }, [products, selectedProducts]);

  const totalOriginPrice = useMemo(() => {
    return selectedProducts.reduce((total, productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        total += product.originPrice * product.quantity;
      }
      return total;
    }, 0);
  }, [selectedProducts, products]);
  const totalDiscount = totalOriginPrice - totalAmount;
  const totalSave = totalDiscount;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProducts(e.target.checked ? products.map((p) => p.id) : []);
  };

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  const handleQuantityChange = (id: number, change: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + change) }
          : product
      )
    );
  };

  const handleUnitChange = (id: number, newUnit: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, unit: newUnit } : product
      )
    );
  };

  return (
    <div className="flex flex-col px-5">
      {/* Đặt div chứa link riêng biệt */}
      <div className="pt-14">
        <Link
          href="/home"
          className="inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>

      <div className="flex pt-4 flex-col lg:flex-row gap-6">
        <div
          className="flex-col bg-[#F5F7F9] rounded-xl "
          style={{ height: `${products.length * 20}%` }}
        >
          <div className="flex items-center justify-between border-b px-4 border-black border-opacity-10 text-sm text-black font-medium">
            <div className="w-[55%] p-5 flex items-center">
              <input
                type="checkbox"
                id="select-all"
                className="peer hidden"
                checked={selectedProducts.length === products.length}
                onChange={handleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="w-5 h-5 text-transparent peer-checked:text-white border border-gray-400 rounded-full flex items-center justify-center cursor-pointer peer-checked:bg-[#0053E2] peer-checked:border-[#0053E2] peer-checked:text-white"
              >
                &#10003;
              </label>

              <label htmlFor="select-all" className="ml-4 cursor-pointer">
                Chọn tất cả
              </label>
            </div>
            <div className="w-[15%] text-center">Giá thành</div>
            <div className="w-[15%] text-center">Số lượng</div>
            <div className="w-[15%] text-center">Đơn vị</div>
            <div className="w-[15%] text-center">Xóa</div>
          </div>

          {products.map((product, index) => (
            <div
              key={product.id}
              className="sticky flex items-center justify-between py-4 px-4 text-sm "
            >
              <div
                className={`absolute bottom-0 left-5 right-5 border-b border-black border-opacity-10 ${
                  index === products.length - 1 ? "hidden" : ""
                }`}
              ></div>
              <div className="w-[55%] flex items-center px-5 py-2">
                <input
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                  type="checkbox"
                  id={`product-${product.id}`}
                  className="peer hidden"
                />
                <label
                  htmlFor={`product-${product.id}`}
                  className=" flex items-center justify-center w-5 h-5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={`product-${product.id}`}
                    className="peer hidden"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                  <span className="w-5 h-5 text-transparent peer-checked:text-white border border-gray-400 rounded-full flex items-center justify-center transition-all peer-checked:bg-[#0053E2] peer-checked:border-[#0053E2] peer-checked:text-white">
                    ✓
                  </span>
                </label>

                <Image
                  src={product.image}
                  alt={product.name}
                  width={55}
                  height={55}
                  className="ml-4 rounded-lg border border-stone-300"
                />
                <span className="ml-2 line-clamp-3 overflow-hidden text-ellipsis">
                  {product.name}
                </span>
              </div>
              <div className="w-[15%] text-center flex flex-col items-center">
                <span className="text-lg font-semibold text-[#0053E2]">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>
                {product.originPrice > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.originPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
              <div className="w-[15%] text-center flex items-center justify-center gap-2">
                <button
                  onClick={() => handleQuantityChange(product.id, -1)}
                  className="px-2 py-1 border rounded disabled:cursor-not-allowed"
                  disabled={product.quantity === 1}
                >
                  -
                </button>
                {product.quantity}
                <button
                  onClick={() => handleQuantityChange(product.id, 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
              <div className="w-[15%] text-center">
                <select
                  className="border rounded px-2 py-1"
                  value={product.unit}
                  onChange={(e) => handleUnitChange(product.id, e.target.value)}
                >
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-[15%] text-center text-black/50 hover:text-black transition-colors">
                <button onClick={() => handleDeleteClick(product.id)}>
                  <ImBin size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Truyền tổng tiền vào OrderSummary */}
        <OrderSummary
          totalAmount={totalAmount}
          totalOriginPrice={totalOriginPrice}
          totalDiscount={totalDiscount}
          totalSave={totalSave}
        />
      </div>

      {/* Dialog xác nhận xóa sản phẩm */}
      {isDeleteDialogOpen && selectedProductId !== null && (
        <DeleteProductDialog
          productId={selectedProductId}
          onClose={handleCloseDialog}
          onConfirm={() => {
            setProducts(products.filter((p) => p.id !== selectedProductId));
            handleCloseDialog();
          }}
        />
      )}
    </div>
  );
};

export default ShoppingCart;
