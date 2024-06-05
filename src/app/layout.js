
import { Inter } from "next/font/google";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Provider from './providers/TanstackProvider'


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Product Feedback app",
  description: "provide feedback on your blah  blah",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
       <Provider>
          < ToastContainer />
          {children}
       </Provider>
      </body>
    </html>
  );
  }

