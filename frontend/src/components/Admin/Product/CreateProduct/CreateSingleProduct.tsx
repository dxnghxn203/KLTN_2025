import { useState, useCallback } from "react";
import Link from "next/link";
import TipTapEditor from "../../TextEditer.tsx/textEditer";
import { PlusCircle, Trash2, Plus } from "lucide-react";
import { LuTrash2 } from "react-icons/lu";
import Thumbnail from "./thumbnail";
import ProductDetails from "./productDetails";
import General from "./general";
import UnitAndPrice from "./unitPrice";

const CreateSingleProduct = () => {
  const unitOptions: string[] = ["Gói", "Hộp", "Viên"];

  interface Item {
    id: number;
    unit: string;
  }

  const [items, setItems] = useState<Item[]>([{ id: 1, unit: "" }]);

  const addItem = () => {
    if (items.length < unitOptions.length) {
      setItems([...items, { id: items.length + 1, unit: "" }]);
    }
  };

  const handleUnitChange = (id: number, value: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, unit: value } : item))
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="">
      <h2 className="text-2xl font-extrabold text-black">Create Order</h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-[#1E4DB7]">
          Home
        </Link>
        <span> / </span>
        <Link href="/create-single-product" className="text-gray-800">
          Create Order
        </Link>
      </div>
      <div className="flex gap-4 h-full">
        <div className="w-2/3 flex flex-col space-y-5">
          <div className="bg-white shadow-sm rounded-2xl p-5 flex flex-col h-full">
            <General />
          </div>
          <UnitAndPrice />
        </div>
        <div className="w-1/3 flex flex-col space-y-5">
          <Thumbnail />
          <ProductDetails />
        </div>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button className="text-sm bg-[#1E4DB7] text-white font-semibold py-3 px-5 rounded-xl hover:bg-[#002E99]">
          Save Changes
        </button>
        <button className="text-sm text-red-500 font-semibold py-3 px-5 rounded-xl border border-red-500 hover:bg-red-500 hover:text-white">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateSingleProduct;
