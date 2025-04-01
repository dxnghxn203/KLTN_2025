"use client";
import React, { useState, useMemo, use, useEffect } from "react";
import { ImBin } from "react-icons/im";
import Image from "next/image";
import DeleteProductDialog from "@/components/Dialog/deleteProductDialog";
import OrderSummary from "@/components/Cart/orderSumary";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

const unitOptions = ["Cái", "Hộp", "Chai", "Gói"];

const ShoppingCart: React.FC = () => {
  const {
    cartLocal,
    updateQuantity,
    updateUnit,
    removeFromCart,
    addCartSelectedLocal,
    cartSelected,
  } = useCart();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const router = useRouter();

  const totalAmount = useMemo(() => {
    return cartLocal
      .filter((product: { id: string }) =>
        selectedProducts.includes(product.id)
      )
      .reduce((total: any, product: any) => total + product.price * product.quantity, 0);
  }, [cartLocal, selectedProducts]);

  const totalOriginPrice = useMemo(() => {
    return selectedProducts.reduce((total, productId) => {
      const product = cartLocal.find((p: any) => p.id === productId);
      if (product) {
        total += product.originPrice * product.quantity;
      }
      return total;
    }, 0);
  }, [selectedProducts, cartLocal]);
  const value = totalOriginPrice - totalAmount;
  const totalDiscount = value > 0 ? value : 0;
  const totalSave = totalDiscount;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProducts(e.target.checked ? cartLocal.map((p: any) => p.id) : []);
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const add = () => {
      addCartSelectedLocal(selectedProducts);
    };
    add();
  }, [selectedProducts]);

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  const handleQuantityChange = (id: string, change: number) => {
    updateQuantity(id, change);
  };

  const handleUnitChange = (id: string, newUnit: string) => {
    updateUnit(id, newUnit);
  };

  const checkout = () => {
    router.push("/thanh-toan");
  };

  return (
    <div className="flex pt-4 flex-col lg:flex-row gap-6 justify-center">
      <div
        className="flex-col bg-[#F5F7F9] rounded-xl w-full "
        style={{ height: `${cartLocal?.length * 20}%` }}
      >
        <div className="flex px-4 items-center justify-between border-b border-black border-opacity-10 text-sm text-black font-medium">
          <div className="w-[55%] p-5 flex items-center">
            <input
              type="checkbox"
              id="select-all"
              className="peer hidden"
              checked={selectedProducts.length === cartLocal?.length}
              onChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="w-5 h-5 text-transparent peer-checked:text-white border border-gray-400 rounded-full flex items-center justify-center cursor-pointer peer-checked:bg-[#0053E2] peer-checked:border-[#0053E2] peer-checked:text-white"
            >
              &#10003;
            </label>

            <label htmlFor="select-all" className="ml-4 cursor-pointer">
              Chọn tất cả ({selectedProducts.length}/{cartLocal?.length})
            </label>
          </div>
          <div className="w-[15%] text-center">Giá thành</div>
          <div className="w-[15%] text-center">Số lượng</div>
          <div className="w-[15%] text-center">Đơn vị</div>
          <div className="w-[15%] text-center"></div>
        </div>

        {cartLocal?.map((product: any, index: any) => (
          <div
            key={product.id}
            className={`flex items-center justify-between py-4 mx-5 text-sm ${
              index !== cartLocal?.length - 1 ? "border-b border-gray-300" : ""
            }`}
          >
            <div className="w-[55%] flex items-center px-4 py-2">
              <label
                htmlFor={`product-${product.id}`}
                className="flex items-center justify-center w-5 h-5 cursor-pointer"
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
                src={product.imageSrc}
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
                onClick={() => {
                  handleQuantityChange(product.id, -1);
                }}
                className="px-2 py-1 border rounded disabled:cursor-not-allowed"
                disabled={product.quantity === 1}
              >
                -
              </button>
              {product.quantity}
              <button
                onClick={() => {
                  handleQuantityChange(product.id, 1);
                }}
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

      <OrderSummary
        totalAmount={totalAmount}
        totalOriginPrice={totalOriginPrice}
        totalDiscount={totalDiscount}
        totalSave={totalSave}
        checkout={checkout}
      />

      {isDeleteDialogOpen && selectedProductId !== null && (
        <DeleteProductDialog
          productId={selectedProductId}
          onClose={handleCloseDialog}
          onConfirm={() => {
            removeFromCart(selectedProductId);
            handleCloseDialog();
          }}
        />
      )}
    </div>
  );
};

export default ShoppingCart;
