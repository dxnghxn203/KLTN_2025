import { useState } from "react";

type FilterType = {
  stockStatus: string;
  category: string;
  bestSeller: string;
  productType: string;
};

interface FilterBarProps {
  onFilterChange: (filters: FilterType) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterType>({
    stockStatus: "",
    category: "",
    bestSeller: "",
    productType: "",
  });

  const handleChange = (key: keyof FilterType, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleClear = () => {
    const clearedFilters = {
      stockStatus: "",
      category: "",
      bestSeller: "",
      productType: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="flex gap-4">
      {/* Bộ lọc */}
      <select
        className="border border-gray-300 px-4 py-2 rounded-lg text-sm "
        value={filters.stockStatus}
        onChange={(e) => handleChange("stockStatus", e.target.value)}
      >
        <option value="">Filter by Stock Status</option>
        <option value="in-stock">In Stock</option>
        <option value="out-of-stock">Stock Out</option>
        <option value="out-of-stock">Stock Low</option>
      </select>

      <select
        className="border border-gray-300 px-4 py-2 rounded-lg text-sm "
        value={filters.category}
        onChange={(e) => handleChange("category", e.target.value)}
      >
        <option value="">Product Category</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
      </select>

      <select
        className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
        value={filters.bestSeller}
        onChange={(e) => handleChange("bestSeller", e.target.value)}
      >
        <option value="">Best Seller</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <button
        className="border border-[#1E4DB7] text-[#1E4DB7] px-6 py-2 rounded-lg hover:bg-blue-100 text-sm"
        onClick={handleClear}
      >
        Reset
      </button>
    </div>
  );
}
