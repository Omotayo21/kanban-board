// utils/localStorage.ts
export const loadProductsFromLocalStorage = () => {
  try {
    const serializedProducts = localStorage.getItem("products");
    if (serializedProducts === null) {
      return [];
    }
    return JSON.parse(serializedProducts);
  } catch (error) {
    console.error("Could not load products", error);
    return [];
  }
};

export const saveProductsToLocalStorage = (products: any[]) => {
  try {
    const serializedProducts = JSON.stringify(products);
    localStorage.setItem("products", serializedProducts);
  } catch (error) {
    console.error("Could not save products", error);
  }
};
