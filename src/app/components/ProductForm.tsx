"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ProductFormProps = {
  existingProduct?: any;
};

const ProductForm: React.FC<ProductFormProps> = ({ existingProduct }) => {
  const [name, setName] = useState(existingProduct?.name || "");
  const [price, setPrice] = useState(existingProduct?.price || "");
  const [category, setCategory] = useState(existingProduct?.category || "");
  const [description, setDescription] = useState(existingProduct?.description || "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      id: existingProduct?.id || Date.now().toString(),
      name,
      price: parseFloat(price),
      category,
      description,
    };

    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");

    if (existingProduct) {
      
      const updatedProducts = storedProducts.map((product: any) =>
        product.id === existingProduct.id ? newProduct : product
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    } else {
     
      storedProducts.push(newProduct);
      localStorage.setItem("products", JSON.stringify(storedProducts));
    }

    router.push("/");
  };

  return (
   
      <form
        onSubmit={handleSubmit}
        className="border-2 border-black rounded-md  flex flex-col gap-[1.2rem] py-4 px-[0.8rem] w-72"
      >
        <label htmlFor="" className="font-bold">
          Product Name
          <span className="relative ">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
              placeholder="e.g eggs"
              className="border-2 border-gray-600 font-semibold outline-none py-2 px-4 rounded-md text-[0.9rem] w-64 "
            />
            <span></span>
          </span>
        </label>
        <label htmlFor="" className="font-bold">
          Price
          <span className="relative ">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              type="number"
              placeholder="e.g 99"
              className="border-2 border-gray-600 font-semibold outline-none py-2 px-4 rounded-md text-[0.9rem] w-64 "
            />
            <span></span>
          </span>
        </label>
        <label htmlFor="" className="font-bold">
          Category
          <span className="relative ">
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              type="text"
              placeholder="e.g Food"
              className="border-2 border-gray-600 font-semibold outline-none py-2 px-4 rounded-md text-[0.9rem] w-64 "
            />
            <span></span>
          </span>
        </label>
        <label htmlFor="" className="font-bold">
          Description
          <span className="relative ">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder=""
              className="border-2 border-gray-600 font-semibold outline-none py-2 px-4 rounded-md text-[0.9rem] h-40 w-64 "
            ></textarea>
            <span></span>
          </span>
        </label>

        <div className="flex ">
          <button className="rounded-md bg-blue-700 text-white text-center p-2 w-64 border border-white">
            {existingProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
   
  );
};

export default ProductForm;
