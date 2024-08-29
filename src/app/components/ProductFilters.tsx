"use client";
import { useState } from "react";

type ProductFiltersProps = {
  onFilter: (category: string, sort: string) => void;
};

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilter }) => {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const handleFilter = () => {
    onFilter(category, sort);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Filter by Category"
        className="p-2 border rounded lg:w-64 sm:w-36 border-black"
      />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="p-2 border rounded lg:w-64 sm:w-24"
      >
        <option value="">Sort by Price</option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>
      <button
        onClick={handleFilter}
        className="bg-blue-600 text-white p-2 rounded lg:w-64 sm:w-24"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default ProductFilters;
