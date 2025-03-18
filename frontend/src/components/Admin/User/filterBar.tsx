import { useState } from "react";

type FilterType = {
  role: string;
  nameOrder: string;
  date: string;
};

interface FilterBarProps {
  onFilterChange: (filters: FilterType) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterType>({
    role: "",
    nameOrder: "",
    date: "",
  });

  const handleChange = (key: keyof FilterType, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearRole = () => {
    setFilters((prev) => ({ ...prev, role: "" }));
  };
  const handleClearNameOrder = () => {
    setFilters((prev) => ({ ...prev, nameOrder: "" }));
  };
  const handleClearDate = () => {
    setFilters((prev) => ({ ...prev, date: "" }));
  };

  return (
    <div className="flex gap-4 justify-between">
      {/* Bộ lọc */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Filter by Role</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearRole}
          >
            Clear
          </span>
        </div>
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={filters.role}
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <option>Select role status</option>
          <option value="in-stock">Admin</option>
          <option value="out-of-stock">User</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Filter by Name</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearNameOrder}
          >
            Clear
          </span>
        </div>

        <select
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={filters.nameOrder}
          onChange={(e) => handleChange("nameOrder", e.target.value)}
        >
          <option value="">Select order</option>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Filter by Create Date</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearDate}
          >
            Clear
          </span>
        </div>

        <input
          type="date"
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={filters.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>
    </div>
  );
}
