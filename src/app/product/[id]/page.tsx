"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

type AddProdPageProps = {
  params: {
    id: string;
  };
};

export default function ProductDetailsPage({ params }: AddProdPageProps) {
  const id = params.id; 
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const productDetails = storedProducts.find(
      (product: any) => product.id === id
    );
    if (productDetails) {
      setProduct(productDetails);
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        {product ? (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-blue-800">
              {product.name}
            </h1>
            <div className="text-lg mb-6">
              <p className="mb-4">
                <strong className="text-gray-800">Price:</strong>{" "}
                <span className="text-green-700 font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </p>
              <p className="mb-4">
                <strong className="text-gray-800">Category:</strong>{" "}
                <span className="text-blue-700 font-medium">
                  {product.category}
                </span>
              </p>
              <p className="mb-4">
                <strong className="text-gray-800">Description:</strong>{" "}
                <span className="text-gray-700">{product.description}</span>
              </p>
            </div>
            <button
              className="mt-4 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        ) : (
          <p className="text-gray-600 text-center text-lg">Loading...</p>
        )}
      </div>
    </>
  );
}
