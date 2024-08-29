import { useEffect } from "react";

const useInitializeProducts = () => {
  useEffect(() => {
  

 const initialProducts = [
  {
    id: "1",
    name: "Smartphone",
    price: 699.99,
    category: "Electronics",
    description:
      "A high-quality smartphone with a stunning display and powerful processor.",
  },
  {
    id: "2",
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    description: "A sleek and powerful laptop for all your computing needs.",
  },
  {
    id: "3",
    name: "Wireless Earbuds",
    price: 199.99,
    category: "Accessories",
    description:
      "Comfortable and high-quality wireless earbuds with noise cancellation.",
  },
  {
    id: "4",
    name: "Gaming Console",
    price: 499.99,
    category: "Entertainment",
    description:
      "The latest gaming console with immersive graphics and gameplay.",
  },
  {
    id: "5",
    name: "Smartwatch",
    price: 299.99,
    category: "Wearables",
    description: "A stylish smartwatch with health tracking and notifications.",
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 129.99,
    category: "Accessories",
    description:
      "Portable Bluetooth speaker with rich sound quality and deep bass.",
  },
  {
    id: "7",
    name: "4K TV",
    price: 799.99,
    category: "Electronics",
    description: "A large 4K TV with vibrant colors and HDR support.",
  },
  {
    id: "8",
    name: "Coffee Maker",
    price: 89.99,
    category: "Home Appliances",
    description:
      "Brew your favorite coffee with this easy-to-use coffee maker.",
  },
  {
    id: "9",
    name: "Digital Camera",
    price: 549.99,
    category: "Photography",
    description:
      "Capture stunning photos with this high-resolution digital camera.",
  },
  {
    id: "10",
    name: "Fitness Tracker",
    price: 149.99,
    category: "Wearables",
    description:
      "Track your fitness progress with this lightweight and durable fitness tracker.",
  },
];


    if (!localStorage.getItem("products")) {
      localStorage.setItem("products", JSON.stringify(initialProducts));
    }
  }, []);
};

export default useInitializeProducts;
