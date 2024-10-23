"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import Loader2 from "./Loader";
import { setIsCreatedNewColumn } from "../redux/uiSlice";


interface CreateColumnProps {
  onClose: () => void;
  boardId: string;
  boardTitle: string;
  existingColumns: { columnName: string }[];
  refetch: () => void;
}

interface Column {
  name: string;
  error: string;
}

const CreateColumn: React.FC<CreateColumnProps> = ({
  onClose,
  boardId,
  boardTitle,
  existingColumns,
  refetch,
}) => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.ui); // Typing useSelector
  const [loadingText, setLoadingText] = useState<boolean>(false);
  const [columnNames, setColumnNames] = useState<Column[]>([
    { name: "", error: "" },
  ]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Function to add a new column input
  const handleAddColumn = () => {
    setColumnNames([...columnNames, { name: "", error: "" }]);
  };

  // Function to remove a column input
  const handleRemoveColumn = (index: number) => {
    const newColumnNames = columnNames.filter((_, i) => i !== index);
    setColumnNames(newColumnNames);
  };

  // Function to update the value of a column and validate the input
  const handleColumnChange = (index: number, value: string) => {
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

  // Function to save columns
  const saveColumns = async () => {
    if (columnNames.some((col) => !col.name.trim() || col.name.length < 3)) {
      alert("All columns must have valid names with at least 3 characters.");
      return;
    }

    try {
      setLoadingText(true);

      // Prepare the columns payload with an empty task array for each column
      const columns = columnNames.map((column) => ({
        columnName: column.name,
        tasks: [],
      }));

   

      const response = await axios.post(
        `/api/boards/${boardId}/columns?id=${boardId}`,
        {
          columns,
        }
      );

      if (response.status === 201) {
         refetch(); 
        toast.success("Columns created successfully!");
        dispatch(setIsCreatedNewColumn(true));
        onClose();
       
      } else {
        console.error("Failed to create columns");
      }
    } catch (error) {
      console.error("Error creating columns:", error);
    } finally {
      setLoadingText(false);
    }
  };

  if (loadingText) {
    return <Loader2 />;
  }

  return (
    <div className="fixed inset-0 z-20 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className={`p-6 rounded-lg shadow-lg lg:w-[500px] sm:w-[300px] md:w-[400px] ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Add New Column</h2>

        {/* Board Title (Read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Board Title</label>
          <input
            type="text"
            value={boardTitle}
            readOnly
            className="w-full p-2 border border-gray-400 rounded-md bg-gray-100 cursor-not-allowed text-black"
          />
        </div>

        {/* Existing Columns (Read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Existing Columns
          </label>
          {existingColumns.length > 0 ? (
            existingColumns.map((col, index) => (
              <input
                key={index}
                type="text"
                value={col.columnName}
                readOnly
                className={`w-full p-2 mb-2 border border-gray-400 rounded-md bg-gray-100 cursor-not-allowed text-black`}
              />
            ))
          ) : (
            <p className="text-gray-500">No existing columns</p>
          )}
        </div>

        {/* New Column Names */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            New Column Names
          </label>
          {columnNames.map((col, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input
                type="text"
                value={col.name}
                onChange={(e) => handleColumnChange(index, e.target.value)}
                placeholder="Enter column name"
                className={`w-full p-2 border ${
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
          <button
            type="button"
            onClick={handleAddColumn}
            className="w-full text-indigo-500 border border-indigo-500 py-2 rounded-md hover:bg-indigo-50"
          >
            + Add Another Column
          </button>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={saveColumns}
          disabled={loadingText}
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
        >
          {loadingText ? "Saving..." : "Save Columns"}
        </button>
      </div>
    </div>
  );
};

export default CreateColumn;
