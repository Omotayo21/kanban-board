"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductFilters from "./ProductFilters";
import useInitializeProducts from "../hooks/useFetch";
import { PencilSimple, Trash } from "phosphor-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const ProductList: React.FC = () => {
  useInitializeProducts();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts: Product[] = JSON.parse(
      localStorage.getItem("products") || "[]"
    );
    setProducts(storedProducts);
  }, []);

  const handleFilter = (category: string, sort: string) => {
    let filtered = products;

    if (category) {
      filtered = products.filter((product) => product.category === category);
    }

    if (sort === "asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setProducts(filtered);
  };

  const handleDelete = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <ProductFilters onFilter={handleFilter} />
      <p className="text-xs text-gray-600 mb-4">
        * Click on product name to view full details
      </p>
      <div className="w-full overflow-x-auto lg:ml-24">
        <table className="min-w-[70rem] bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="border px-2 py-1 md:px-4 md:py-2">
                  <Link
                    href={`/product/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="border px-2 py-1 md:px-4 md:py-2">
                  ${product.price.toFixed(2)}
                </td>
                <td className="border px-2 py-1 md:px-4 md:py-2">
                  {product.category}
                </td>
                <td className="border px-2 py-1 md:px-4 md:py-2">
                  <div className="flex flex-row gap-x-8">
                    <Link
                      href={`/edit-product/${product.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilSimple size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
