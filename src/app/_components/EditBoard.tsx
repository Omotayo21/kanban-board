"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { setIsEditedBoard } from "../redux/uiSlice";

interface EditBoardProps {
  onClose: () => void;
  activeBoardId: string;
  currentBoardTitle: any;
  existingColumns: { columnName: string }[];
  fetchBoard: () => void;
  refetch: () => void;
  currentBoard : any;
}
type Column = {
  name: string;
  error: string;
  isNew: boolean;
};

type Board = {
  boardTitle: string;
  boardTitleError: boolean;
  columns: Column[];
};


const EditBoard: React.FC<EditBoardProps> = ({
  onClose,
  activeBoardId,
  currentBoardTitle,
  existingColumns,
  fetchBoard,
  refetch,
}) => {
  const dispatch = useAppDispatch()
  const { darkMode } = useAppSelector((state) => state.ui);
 const [boardTitle, setBoardTitle] = useState<string>(currentBoardTitle);
 const [boardTitleError, setBoardTitleError] = useState<boolean>(false);
 const modalRef = useRef<HTMLDivElement>(null);
  const [loadingText, setLoadingText] = useState(false);
 const [columnNames, setColumnNames] = useState<Column[]>([]);
 const [columnErrors, setColumnErrors] = useState([]);
  useEffect(() => {

    const initialColumns= existingColumns.map((col) => ({
      name : col.columnName,
      error: "",
      isNew: false, 
    } ));
    setColumnNames(initialColumns);
  }, [existingColumns]);

  useEffect(() => {
    const handleClickOutside = (event : MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAddColumn = () => {
    setColumnNames([...columnNames, { name: "", error: "", isNew: true }]);
  };

  const handleBoardNameChange = (e : any) => {
    const value = e.target.value;
    setBoardTitle(value);

    if (value.length < 3) {
      setBoardTitleError(true);
    } else {
      setBoardTitleError(false);
    }
  };

  // Function to remove a column input (existing or new)
  const handleRemoveColumn = (index : number) => {
    const newColumnNames = columnNames.filter((_, i) => i !== index);
    setColumnNames(newColumnNames);
  };

  // Function to update the value of a column and validate the input
  const handleColumnChange = (index : number, value : string) => {
    const newColumnNames = columnNames.map((col, i) => {
      if (i === index) {
        return {
          ...col,
          name: value,
          error: value.length < 3 ? "Must not be less than 3 characters" : "",
        };
      }
      return col;
    });
    setColumnNames(newColumnNames);
  };

const handleSaveChanges = async () => {
  if (boardTitle.length < 3) {
    setBoardTitleError(true);
    return;
  }

  const columnErrors = columnNames.map((col) => col.name.length < 3);
  if (columnErrors.some((error) => error)) {
    return; // Prevent submission if any column has an error
  }

  setLoadingText(true);

  try {
    const columnsToUpdate = columnNames.map((col) => col.name); // Extract just the column names

    const response = await axios.put(`/api/boards/${activeBoardId}`, {
      boardTitle,
      columns: columnsToUpdate, // Pass only the names to the backend
    });
    
    toast.success("Board successfully edited");

    fetchBoard();
    refetch();
    onClose();
    dispatch(setIsEditedBoard(true));
  } catch (error) {
    console.error("Error updating board:", error);
  } finally {
    setLoadingText(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className={`p-6 rounded-lg shadow-lg lg:w-[500px] sm:w-[300px] md:w-[400px] ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Edit Board
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700">Board Title</label>
          <input
            type="text"
            value={boardTitle}
            onChange={handleBoardNameChange}
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

        {/* Editable Columns */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Columns</label>
          {columnNames.map((col, index) => (
            <div key={index} className="mb-2 flex items-center bg-transparent">
              <input
                type="text"
                value={col.name}
                onChange={(e) => handleColumnChange(index, e.target.value)}
                placeholder="Enter column name"
                className={`w-full p-2 border bg-transparent ${
                  col.error ? "border-red-500" : "border-gray-400"
                } rounded-md`}
              />
              <button
                type="button"
                onClick={() => handleRemoveColumn(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaTimes size={20} />
              </button>
              {col.error && (
                <p className="text-red-500 text-sm mt-1">
                  Cannot be empty or less than 3 characters
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full text-indigo-500 border border-indigo-500 py-2 rounded-[1.5rem] hover:bg-indigo-50 transition duration-200 mb-4"
          onClick={handleAddColumn}
        >
          + Add New Column
        </button>

        <button
          type="button"
          onClick={handleSaveChanges}
          className={`w-full text-white py-2 rounded-[1.5rem] hover:bg-indigo-600 transition duration-200 ${ loadingText ?'bg-indigo-400 opacity-50 cursor-not-allowed' :'bg-indigo-600'}`}
        >
          {loadingText ? "Saving changes" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditBoard;
