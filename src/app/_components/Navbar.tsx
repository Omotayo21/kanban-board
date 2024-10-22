"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical, BsChevronDown, BsPlus } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import Image from "next/image";
import logoMobile from "../assets/logo-mobile.svg";
import EditBoard from "./EditBoard";
import DeleteModal from "./DeleteModal";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Link from "next/link";
import CreateTask from "./CreateTask";
import { useRouter } from "next/navigation";
import { toggleMobileNav } from "../redux/uiSlice";
import { RootState } from "../redux/store"; 

interface NavbarProps {
  activeBoardId: any;
  refetch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeBoardId, refetch }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { darkMode, isMobileNavOpen, isCreatedNewColumn } = useSelector(
    (state: RootState) => state.ui
  ); // Update according to your store's state shape

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentBoard, setCurrentBoard] = useState<any>(null); // Adjust type according to your board structure
  const [showCreateTask, setShowCreateTask] = useState(false);

  // Function to toggle mobile sidebar
  const toggleSidebar = () => {
    dispatch(toggleMobileNav());
  };

  const openEditTask = () => {
    setShowCreateTask(true);
  };

  const fetchBoard = async () => {
    try {
      const response = await axios.get(
        `/api/boards/${activeBoardId}?id=${activeBoardId}`
      );
      const data = response.data;
      setCurrentBoard(data);
    } catch (error) {
      console.error("Error fetching board:", error);
    }
  };

  useEffect(() => {
    if (activeBoardId) {
      fetchBoard(); 
    }
  }, [activeBoardId]);

  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setIsOptionsOpen(false);
      }
    };

    if (isOptionsOpen) {
      document.addEventListener("mouseup", handleClickOutside);
    } else {
      document.removeEventListener("mouseup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsOpen]);

  const logout = async () => {
    try {
      await axios.get("/api/logout");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      
    }
  };

  if (isCreatedNewColumn) {
    fetchBoard();
  }

  return (
    <div
      className={`fixed top-0 lg:ml-[280px] sm:-ml-6 w-full border-b border-gray-300 h-28 ${
        darkMode ? "bg-gray-800 text-white" : "bg-[#F4F7FD] text-[#20212c]"
      }`}
    >
      <div className="flex flex-row m-8 sm:justify-between">
        <div className="flex flex-row gap-x-2 sm:w-[7rem] lg:w-full">
          <Image
            alt="logo"
            src={logoMobile}
            className="w-[30px] h-[20px] mt-2 lg:hidden md:hidden"
          />
          <h2 className="font-bold lg:text-[2rem] flex flex-row">
            {currentBoard ? currentBoard.boardTitle : "Select a Project"}
          </h2>
          <BsChevronDown
            size={20}
            className={`text-gray-500 lg:hidden md:hidden mt-2 ${
              isMobileNavOpen ? "rotate-180" : "rotate-0"
            }`}
            onClick={toggleSidebar}
          />
        </div>
        <div className="lg:absolute md:absolute md:right-[19rem] lg:right-[13rem] sm:flex sm:flex-row lg:gap-8 sm:gap-2">
          <button onClick={logout}>
            <CiLogout className="text-[2rem] lg:mt-3 sm:mt-2" />
          </button>
          <button
            className={`ml-6 rounded-[1.2rem] bg-[#635fc7] font-bold text-white lg:py-3 lg:px-6 sm:px-2 items-center flex flex-row ${
              !activeBoardId ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={openEditTask}
          >
            <BsPlus className="text-[2rem]" />
            <span className="sm:hidden md:block lg:block">Add New Task</span>
          </button>
          <BsThreeDotsVertical
            className={`text-[1rem] text-gray-400 lg:mr-40 mt-4  ${
              !activeBoardId ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => setIsOptionsOpen((prev) => !prev)}
          />
          {isOptionsOpen && (
            <div
              ref={optionsRef}
              className={`absolute lg:right-[13rem] z-50 md:right-[8rem] sm:right-0 lg:top-[5rem] sm:top-[7rem] md:top-[4rem] flex w-full flex-col gap-[1.6rem] p-[1.6rem] shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] sm:w-[12rem] ${
                darkMode ? "bg-gray-800 " : "bg-[#F4F7FD] "
              }`}
            >
              <p
                onClick={() => setShowEditBoard(true)}
                className="cursor-pointer text-[1.4rem] font-medium leading-[2.3rem] text-[#828fa3]"
              >
                Edit Board
              </p>
              <p
                onClick={() => setShowDeleteModal(true)}
                className="cursor-pointer text-[1.4rem] font-medium leading-[2.3rem] text-[#ea5555]"
              >
                Delete Board
              </p>
            </div>
          )}
        </div>
        {showEditBoard && (
          <EditBoard
            currentBoard={currentBoard}
            onClose={() => setShowEditBoard(false)}
            activeBoardId={activeBoardId} // Pass the boardId
            existingColumns={currentBoard.columns}
            refetch={refetch}
            fetchBoard={fetchBoard}
            currentBoardTitle={currentBoard.boardTitle}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            onConfirm={() => setShowDeleteModal(false)}
            activeBoardId={activeBoardId}
            onClose={() => setShowDeleteModal(false)}
            fetchBoard={fetchBoard}
          />
        )}
        {showCreateTask && (
          <CreateTask
            onClose={() => setShowCreateTask(false)}
            boardId={currentBoard._id} // Pass the boardId
            columns={currentBoard.columns}
            refetch={refetch}
            fetchBoard={fetchBoard}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
