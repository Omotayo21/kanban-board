import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./redux/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Provider from "./providers/TanstackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kanban board",
  description: "Arrange your tasks easily",
};

interface RootLayoutProps {
  children: React.ReactNode; 
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Provider>
            <ToastContainer />
            {children}
          </Provider>
        </ReduxProvider>
      </body>
    </html>
  );
}
