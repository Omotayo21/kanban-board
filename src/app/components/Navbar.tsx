"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-white text-2xl font-extrabold hover:text-blue-300 transition-colors duration-300"
        >
          Rahman Store
        </Link>
        <div className="space-x-4">
        
          <Link
            href="/add-product"
            className="text-blue-900 bg-white p-3 rounded-md sm:text-sm lg:text-lg font-medium hover:text-blue-300 transition-colors duration-300"
          ><button>
            Add Product
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
