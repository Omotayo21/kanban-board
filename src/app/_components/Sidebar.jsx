import React from 'react'
import Image from 'next/image'
import desktopbg from '../../../public/suggestions/desktop/background-header.png'
import Link from 'next/link';
import { X } from 'phosphor-react';

const Sidebar = ({ popIn, setSelectedCategory}) => {
   const categories = ["All", "enhancement", "feature", "bug", "UI", "UX"];
  return (
    <>
      <aside className="lg:flex flex-col mt-4 gap-y-4 ml-4 sm:hidden ">
        <div className=" lg:rounded-lg  lg:w-56 lg:h-28 lg:relative  ">
          <Image
            src={desktopbg}
            alt=" Desktop Background"
            objectFit=""
            className="w-full h-full object-cover rounded-md  "
          />
          <div className=" inset-0 absolute pt-12 pl-4">
            <h1 className=" font-semibold text-white">Rahman's space</h1>
            <h2 className="text-gray-200 text-sm">Feedback Board</h2>
          </div>
        </div>
        <ul className="rounded-md bg-red-300 w-56 h-32 flex flex-wrap items-center gap-x-3 gap-y-2 p-[1.0rem]">
          {categories.map((category, index) => (
            <li key={index}>
              <button
                onClick={() => setSelectedCategory(category)}
                className="text-blue-600 font-semibold bg-gray-200 hover:bg-blue-600 hover:text-white px-3 py-1 text-sm rounded-md"
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
        <div className="rounded-md bg-red-300 h-40 w-56 p-6 ">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-bold text-blue-900">Roadmap</h3>
            <Link
              href="/roadmap"
              className="text-sm hover:underline cursor-pointer"
            >
              View
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[0.8rem]">
                <div className="rounded-full h-3 w-3 bg-purple-600"></div>
                <p className="text-sm text-blue-900">Planned</p>
              </div>
              <p className="text-sm font-bold text-blue-800">3</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[0.8rem]">
                <div className="rounded-full h-3 w-3 bg-purple-600"></div>
                <p className="text-sm text-blue-900">In-progress</p>
              </div>
              <p className="text-sm font-bold text-blue-800">2</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[0.8rem]">
                <div className="rounded-full h-3 w-3 bg-purple-600"></div>
                <p className="text-sm text-blue-900">Live</p>
              </div>
              <p className="text-sm font-bold text-blue-800">1</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="sm:h-[100vh] fixed lg:hidden w-56 bg-gray-100 sm:flex flex-col gap-y-4 right-0">
        
        <ul className="rounded-md bg-white mt-24 w-56 h-32 flex flex-wrap items-center gap-x-3 gap-y-2 p-[1.0rem] ">
          {categories.map((category, index) => (
            <li key={index}>
              <button
                onClick={() => setSelectedCategory(category)}
                className="text-blue-600 font-semibold bg-gray-200 hover:bg-blue-600 hover:text-white px-3 py-1 text-sm rounded-md"
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
        <div className="rounded-md bg-white h-40 w-56 p-6 ">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-bold text-blue-900">Roadmap</h3>
            <Link
              href="/roadmap"
              className="text-sm hover:underline cursor-pointer"
            >
              View
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[0.8rem]">
                <div className="rounded-full h-3 w-3 bg-purple-600"></div>
                <p className="text-sm text-blue-900">Planned</p>
              </div>
              <p className="text-sm font-bold text-blue-800">3</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[0.8rem]">
                <div className="rounded-full h-3 w-3 bg-purple-600"></div>
                <p className="text-sm text-blue-900">In-progress</p>
              </div>
              <p className="text-sm font-bold text-blue-800">2</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[0.8rem]">
                <div className="rounded-full h-3 w-3 bg-purple-600"></div>
                <p className="text-sm text-blue-900">Live</p>
              </div>
              <p className="text-sm font-bold text-blue-800">1</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar
