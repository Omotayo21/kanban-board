import { Inter } from "next/font/google";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rahman store product list",
  description: "Explore our diverse range of product at Rahman Store. Find the detailed information, prices and categories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     
      <body className={inter.className}>

          <ToastContainer />
          {children}
 
      </body>
   
    </html>
  );
}
