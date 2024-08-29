"use client";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";

export default function AddProductPage() {
  return (
    <>
      <Navbar />
      <button
        className="mt-4 ml-20 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
      <div className="container mx-auto p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Add Product</h1>
        <ProductForm />
      </div>
    </>
  );
}
