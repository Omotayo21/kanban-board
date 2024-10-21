"use client";

import React, { useState } from "react";
import Toggle from "./Toggle";
import logodark from "../assets/logo-dark.svg";
import logolight from "../assets/logo-light.svg";
import { TbLayoutBoardSplit } from "react-icons/tb";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import Image from "next/image";
import CreateBoard from "./CreateBoard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader2 from "./Loader";

interface Board {
  _id: string;
  boardTitle: string;
}

interface SidebarProps {
  activeBoardId: string;
}

const fetchBoards = async (): Promise<Board[]> => {
  const response = await axios.get(`/api/boards`);
  return response.data;
};

const Sidebar: React.FC<SidebarProps> = ({ activeBoardId }) => {
  const dispatch = useAppDispatch();
  const { darkMode, isMobileNavOpen, isEditedBoard } = useAppSelector(
    (state) => state.ui
  );
  const [isCreateBoardModalOpen, setCreateBoardModalOpen] =
    useState<boolean>(false);

  const {
    data: boards = [],
    refetch,
    isLoading,
    isError,
  } = useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  const handleCreateBoardModal = () => {
    setCreateBoardModalOpen(true);
  };

  if (isLoading) {
    return <Loader2 />;
  }

  if (isError) {
    return <p>Error fetching boards...</p>;
  }

  if (isEditedBoard) {
    refetch();
  }

  return (
    <div
      className={`lg:z-10 fixed top-0 left-0 w-[300px] h-screen lg:flex sm:flex md:flex flex-col justify-between border-r border-black ${
        darkMode ? "bg-gray-800 text-white" : "bg-[#F4F7FD] text-[#20212c]"
      } ${
        isMobileNavOpen
          ? "sm:fixed sm:left-1/2 sm:top-[8rem] sm:z-20 sm:h-[35rem] sm:-translate-x-1/2 sm:overflow-auto sm:rounded-[0.8rem] sm:py-[1.6rem] border-r-0 sm:shadow-[1rem_1rem_2rem_2rem_rgba(54,78,126,0.25)] lg:flex md:flex"
          : "sm:hidden"
      }`}
    >
      <div>
        <Image
          src={darkMode ? logolight : logodark}
          alt="Logo"
          className="w-[200px] ml-5 mt-5 sm:hidden md:flex"
        />
        {boards.length > 0 ? (
          <ul className="mt-4 gap-y-8 flex flex-col sm:ml-4">
            <h2 className="text-[#635fc7] font-semibold mt-4 ">
              All boards ({boards.length})
            </h2>
            {boards.map((board) => {
              const isActiveBoard = board._id === activeBoardId;
              return (
                <div className="flex flex-col gap-y-2" key={board._id}>
                  <li
                    className={`flex flex-row gap-4 py-2 mr-12 font-semibold cursor-pointer items-center ${
                      isActiveBoard
                        ? "bg-purple-600 text-white"
                        : "text-[#635fc7] hover:bg-gray-300"
                    } rounded-md p-2 transition-colors`}
                  >
                    <TbLayoutBoardSplit size={20} className="mt-1" />
                    <Link href={`/dashboard/${board._id}`} className="w-full">
                      {board.boardTitle || "Unnamed Board"}
                    </Link>
                  </li>
                </div>
              );
            })}
          </ul>
        ) : (
          <p className="lg:mt-16 md:mt-16 font-semibold text-gray-600">
            No boards
          </p>
        )}
        <li
          className="flex flex-row gap-2 font-semibold text-[#635fc7] cursor-pointer pl-2 mt-4"
          onClick={handleCreateBoardModal} // Trigger create board modal
        >
          <TbLayoutBoardSplit size={20} className="mt-1" /> +Create new board
        </li>
      </div>
      <Toggle />
      {isCreateBoardModalOpen && (
        <CreateBoard
          setCreateBoardModalOpen={setCreateBoardModalOpen}
          refetchBoards={refetch} 
        />
      )}
    </div>
  );
};

export default Sidebar;
