"use client";
import React from "react";
import Image from "next/image";
import logodark from "./assets/logo-dark.svg";
import { useRouter } from "next/navigation";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { BsThreeDotsVertical, BsChevronDown, BsPlus } from "react-icons/bs";

// TypeScript component type
const Page: React.FC = () => {
  const router = useRouter();

 
  const handleLoginClick = (): void => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      <div
        className={`lg:fixed lg:block bg-gray-200 top-0 lg:ml-[255px] sm:hidden w-full border-b border-gray-300 h-28 p-4 `}
      >
        <div className="lg:absolute md:absolute md:right-[19rem] lg:right-[13rem] sm:flex sm:flex-row lg:gap-8 sm:gap-2 mt-2">
          <button className=" cursor-not-allowed ml-6 rounded-[1.2rem] bg-[#635fc7] font-bold text-white lg:py-3 lg:px-6 sm:px-2 items-center flex flex-row">
            <BsPlus className="text-[2rem]" />
            <span className="sm:hidden md:block lg:block">Add New Task</span>
          </button>
          <BsThreeDotsVertical className="cursor-not-allowed text-[1rem] text-gray-400 lg:mr-40 mt-4" />
        </div>
      </div>

      {/* Fake Sidebar */}
      <div className="lg:w-64 lg:block sm:hidden bg-gray-300 border-l-2 border-gray-700 text-white lg:flex-none">
        <Image
          src={logodark}
          alt="Logo"
          className="lg:w-[200px] ml-5 mt-5 sm:hidden md:flex"
        />
        <p className="lg:mt-16 md:mt-16 font-semibold text-gray-600">
          No boards
        </p>
        <p className="flex flex-row gap-2 font-semibold text-[#635fc7] cursor-not-allowed pl-2 mt-4">
          <TbLayoutBoardSplit size={20} className="mt-1" /> +Create new board
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        {/* Centered Message */}
        <div className="flex flex-col items-center mt-10">
          <p className="text-xl font-semibold mb-4 text-indigo-500">
            Please sign in to enjoy the kanban app.
          </p>
          <button
            className={`w-full text-white bg-indigo-500 hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center `}
            onClick={handleLoginClick}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
