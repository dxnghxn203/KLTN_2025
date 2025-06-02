// components/CartTableDesktop.tsx
import Image from "next/image";
import { ImBin } from "react-icons/im";

export default function CartTableDesktop({
  cart,
  selectedProducts,
  handleSelectAll,
  handleSelectProduct,
  handleDeleteClick,
  handleShowSimilarProducts,
  renderOriginalPrice,
  renderQuantityControls,
  renderUnit,
  renderTotalPrice,
  loadingGetCart,
}: any) {
  return (
    <table className="w-full text-sm hidden md:table">
      <thead className="bg-gray-100">
        <tr className="border-b border-gray-300">
          <th className="text-left px-4 py-3 font-normal">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                checked={cart && selectedProducts.length === cart?.length}
                onChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="ml-2 cursor-pointer">
                Chọn tất cả ({selectedProducts.length}/{cart?.length})
              </label>
            </div>
          </th>
          <th className="text-center px-4 py-3 font-normal">Giá thành</th>
          <th className="text-center px-4 py-3 font-normal">Số lượng</th>
          <th className="text-center px-4 py-3 font-normal">Đơn vị</th>
          <th className="text-center px-4 py-3 font-normal">Thành tiền</th>
          <th className="text-center px-4 py-3 font-normal">Hành động</th>
        </tr>
      </thead>
      <tbody className={loadingGetCart ? "pointer-events-none opacity-50" : ""}>
        {cart?.map((product: any, index: number) => (
          <tr
            key={`product-${product.product.product_id}-${product.price_id}`}
            className={`${
              index === cart.length - 1 ? "" : "border-b border-gray-200"
            }`}
          >
            <td className="px-4 py-3">
              <label
                htmlFor={`product-${product.product.product_id}-${product.price_id}`}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={`product-${product.product.product_id}-${product.price_id}`}
                  checked={selectedProducts.some(
                    (item: any) =>
                      item.product_id === product.product.product_id &&
                      item.price_id === product.price_id
                  )}
                  onChange={() =>
                    handleSelectProduct(
                      product.product.product_id,
                      product.price_id
                    )
                  }
                  className="h-6 w-6 text-blue-600 border-gray-300 rounded"
                />
                <Image
                  src={product?.product?.images_primary}
                  alt={product.product?.product_name || "Product Image"}
                  width={55}
                  height={55}
                  className="ml-2 p-1 rounded-lg border border-stone-300"
                />
                <span className="ml-2 max-w-[180px] line-clamp-3">
                  {product?.product?.name_primary}
                </span>
              </label>
            </td>
            <td className="text-center px-4 py-3">
              {renderOriginalPrice(product, product.price_id)}
            </td>
            <td className="text-center px-4 py-3">
              {renderQuantityControls(product, product.price_id)}
            </td>
            <td className="text-center px-4 py-3">
              {renderUnit(product, product.price_id)}
            </td>
            <td className="text-center px-4 py-3">
              {renderTotalPrice(product, product.price_id)}
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-col items-center gap-1">
                <button
                  title="Xóa sản phẩm"
                  onClick={() =>
                    handleDeleteClick(
                      product.product.product_id,
                      product.price_id
                    )
                  }
                  className="text-gray-500 hover:text-red-600"
                >
                  <ImBin size={16} />
                </button>
                <button
                  title="Tìm sản phẩm tương tự"
                  onClick={() => handleShowSimilarProducts(product)}
                  className="text-xs text-red-500 font-medium"
                >
                  Tìm sản phẩm tương tự
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
