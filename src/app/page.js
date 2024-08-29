'use client'
import React from 'react'
import Navbar from './components/Navbar'
import ProductList from './components/ProductTable'

const page = () => {
  return (
    <div>
      <div>
        <Navbar />
        <div className="container mx-auto mt-4">
          <h1 className="text-2xl font-bold mb-4">Product Listing</h1>
          <ProductList />
        </div>
      </div>
    </div>
  );
}

export default page