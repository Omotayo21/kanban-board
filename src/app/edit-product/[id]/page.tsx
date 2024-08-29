"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ProductForm from "../../components/ProductForm";

type EditProdPageProps = {
  params: {
    id: string;
  };
};
export default function EditProductPage({ params }: EditProdPageProps) {
  const id = params.id;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const productToEdit = storedProducts.find(
      (product: any) => product.id === id
    );
    if (productToEdit) {
      setProduct(productToEdit);
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <button
        className="mt-4 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
      <div className="container mx-auto p-4 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
        {product ? (
          <ProductForm existingProduct={product} />
        ) : (
          <p className="Loader"></p>
        )}
      </div>
    </>
  );
}
