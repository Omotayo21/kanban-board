'use client'
import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import {toast} from "react-toastify"
import { useAppSelector } from "../redux/hook";
import axios from   "axios";
interface CreateBoardProps {

  setCreateBoardModalOpen: any;
  refetchBoards: () => void;
}
const CreateBoard : React.FC<CreateBoardProps> = ({ setCreateBoardModalOpen, refetchBoards }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [boardTitleError, setBoardTitleError] = useState<boolean>(false);
  const [columnErrors, setColumnErrors] = useState([]);

  const { darkMode } = useAppSelector((state) => state.ui);
  const [boardTitle, setBoardTitle] = useState<string>("");
  const [columns, setColumns] = useState([""]); 

  const closeBoardModal = () => {
    setCreateBoardModalOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      
      if ( modalRef.current &&!modalRef.current.contains(event.target as Node)
      ) {
        closeBoardModal();
      }
    };
   
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeBoardModal]);

  // Handle input for board name
  const handleBoardNameChange = (e: any) => {
    const value = e.target.value;
    setBoardTitle(value);

    if (value.length < 3) {
      setBoardTitleError(true);
    } else {
      setBoardTitleError(false);
    }
  };

  // @ts-ignore
  const handleColumnChange = (index, value) => {
    const newColumns = [...columns];
    const newColumnErrors = [...columnErrors];

    newColumns[index] = value;

  
    if (value.length < 3) {
      // @ts-ignore
      newColumnErrors[index] = true;
    } else {
      // @ts-ignore
      newColumnErrors[index] = false;
    }

    setColumns(newColumns);
    setColumnErrors(newColumnErrors);
  };

  const addNewColumn = () => {
    setColumns([...columns, ""]);
  };

  // @ts-ignore
  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  
  const handleCreateBoard = async () => {
    if (boardTitle.length < 3) {
      setBoardTitleError(true);
      return;
    }

    const newColumnErrors = columns.map((column) => column.length < 3);
    // @ts-ignore
    setColumnErrors(newColumnErrors);

    if (newColumnErrors.some((error) => error)) {
      return; 
    }

    try {
      const response = await axios.post("/api/boards", {
        boardTitle,
        columns,
      });
      console.log("Board created:", response.data);
      toast.success("Board successfully created");
      closeBoardModal();
      refetchBoards();
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className={`p-8 rounded-lg shadow-lg max-w-lg w-full ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Add New Board
        </h2>

        {/* Board Name Input */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-600 mb-2">
            Board Name
          </label>
          <input
            type="text"
            value={boardTitle}
            onChange={handleBoardNameChange}
            placeholder="Enter your Board name here"
            className={`w-full px-4 py-2 bg-transparent outline-none border ${
              boardTitleError ? "border-red-500" : "border-gray-600"
            } rounded-lg focus:outline-none `}
          />
          {boardTitleError && (
            <p className="text-red-500 text-sm mt-1">
              Must not be less than 3 characters
            </p>
          )}
        </div>

        {/* Board Columns Section */}
        <div>
          <label className="block font-semibold text-gray-600 mb-2">
            Board Columns
          </label>
          <div className="max-h-40 overflow-auto">
            {columns.map((col, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={col}
                  onChange={(e) => handleColumnChange(index, e.target.value)}
                  placeholder="Enter your column name here"
                  className={`w-full px-4 py-2 bg-transparent border ${
                    columnErrors[index] ? "border-red-500" : "border-gray-600"
                  } rounded-lg  `}
                />
                <button
                  type="button"
                  onClick={() => removeColumn(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaTimes size={20} />
                </button>
                {columnErrors[index] && (
                  <p className="text-red-500 text-sm mt-1">
                    Must not be less than 3 characters
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Column Button */}
        <button
          type="button"
          onClick={addNewColumn}
          className="w-full text-indigo-500 border border-indigo-500 py-2 rounded-[1.5rem] hover:bg-indigo-50 transition duration-200 mb-4"
        >
          + Add New Column
        </button>

        {/* Create New Board Button */}
        <button
          type="button"
          onClick={handleCreateBoard}
          className="w-full bg-indigo-500 text-white py-2 rounded-[1.5rem] hover:bg-indigo-600 transition duration-200"
        >
          Create New Board
        </button>
      </div>
    </div>
  );
};

export default CreateBoard;

