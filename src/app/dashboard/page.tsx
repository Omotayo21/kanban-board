'use client'
import Navbar from "../_components/Navbar";
import Sidebar from "../_components/Sidebar";
import React from "react";
import { useAppSelector } from "../redux/hook";

const Dashboard = () => {
     const { darkMode } = useAppSelector((state) => state.ui);
  return (
    <div
      className={`h-screen flex flex-col p-4 ${
        darkMode ? "bg-gray-800 text-white" : "bg-[#F4F7FD] text-[#20212c]"
      }`}
    >
      <Navbar />
      <Sidebar />
      <h2 className="text-2xl mt-48 flex flex-row items-center justify-center  text-gray-500">
        Pls select a board to show or create new board
      </h2>
    </div>
  );
};

export default Dashboard;
