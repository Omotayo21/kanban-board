"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { toast } from "react-toastify";
import Loader2 from "./Loader";
import { setIsCreatedNewColumn } from "../redux/uiSlice";
import { BsChevronDown } from "react-icons/bs";
interface CreateTaskProps {
  onClose: () => void;
  boardId: string;

  columns: Column[];
  fetchBoard: () => void;
  refetch: () => void;
}
interface Column {
  _id: string;
  columnName: string;
}
const CreateTask:React.FC<CreateTaskProps> = ({ onClose, boardId, refetch, columns }) => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.ui);
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState(""); 
  const [subtasks, setSubtasks] = useState([{ title: "", isCompleted: false }]); 
  const [loadingText, setLoadingText] = useState(false);
 const [errors, setErrors] = useState({
   titleError: "",
   subtaskErrors: [] as string[], 
   columnError: "",
 });

  const [isOpen, setIsOpen] = useState(false);

 const handleSelect = (columnId: string) => {
   setSelectedColumnId(columnId);
   setIsOpen(false); 
 };

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


  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: "", isCompleted: false }]); 
    setErrors({ ...errors, subtaskErrors: [...errors.subtaskErrors, ""] }); 
  };

const handleRemoveSubtask = (index: number) => {
  const newSubtasks = subtasks.filter((_, i) => i !== index);
  const newSubtaskErrors = errors.subtaskErrors.filter((_, i) => i !== index);
  setSubtasks(newSubtasks);
  setErrors({ ...errors, subtaskErrors: newSubtaskErrors });
};


 const handleSubtaskChange = (index: number, key: string, value: string) => {
   const newSubtasks = subtasks.map((subtask, i) =>
     i === index ? { ...subtask, [key]: value } : subtask
   );
   const newSubtaskErrors = errors.subtaskErrors.map((err, i) =>
     i === index && value.length < 3 ? "Must be at least 3 characters" : ""
   );
   setSubtasks(newSubtasks);
   setErrors({ ...errors, subtaskErrors: newSubtaskErrors });
 };


  const handleCreateTask = async () => {
  
    let subtaskValidationErrors = subtasks.map((subtask) =>
      subtask.title.trim().length < 3 ? "Must be at least 3 characters" : ""
    );

    if (
      !title.trim() ||
      title.trim().length < 3 ||
      !description.trim() ||
      !selectedColumnId
    ) {
      setErrors({
        titleError:
          !title.trim() || title.trim().length < 3
            ? "Must be at least 3 characters"
            : "",
        subtaskErrors: subtaskValidationErrors,
        columnError: !selectedColumnId ? "Please select a column" : "",
      });
      return;
    }

    if (subtaskValidationErrors.some((error) => error)) {
      setErrors({
        titleError: "",
        subtaskErrors: subtaskValidationErrors,
        columnError: "", 
      });
      return;
    }

    try {
      setLoadingText(true);
      const taskData = {
        title,
        description,
        status: selectedColumnId,
        columnId: selectedColumnId,
        subtasks: subtasks.map((subtask) => ({
          title: subtask.title,
          isCompleted: subtask.isCompleted || false,
        })),
      };

      const response = await axios.post(
        `/api/boards/${boardId}/tasks?columnId=${selectedColumnId}&boardId=${boardId}`,
        taskData
      );

      console.log("Task created:", response.data);
      toast.success("Task created successfully");

 dispatch(setIsCreatedNewColumn(true));
      onClose();
      dispatch(setIsCreatedNewColumn(true));
      refetch()
    } catch (error : any) {
      console.error(
        "Error creating task:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoadingText(false);
    }
  };
 if (loadingText) {
   return <Loader2 />;
 }
  return (
    <>
      <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
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
            Add New Task
          </h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              placeholder="Enter your title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 border ${
                errors.titleError ? "border-red-500" : "border-gray-400"
              } rounded-md bg-transparent`}
            />
            {errors.titleError && (
              <p className="text-red-500 text-sm mt-1">{errors.titleError}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your description here"
              className="w-full p-2 border border-gray-400 rounded-md bg-transparent"
            ></textarea>
          </div>

          {/* Subtasks */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Subtasks</label>
            <div className="max-h-28 overflow-auto">
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) =>
                      handleSubtaskChange(index, "title", e.target.value)
                    }
                    placeholder="Enter your subtask name here"
                    className={`w-full p-2 border ${
                      errors.subtaskErrors[index]
                        ? "border-red-500"
                        : "border-gray-400"
                    } rounded-md bg-transparent`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(index)}
                    className="ml-2 text-red-500"
                  >
                    X
                  </button>
                </div>
              ))}
              {errors.subtaskErrors.map(
                (error, index) =>
                  error && (
                    <p
                      key={index}
                      className="text-red-500 text-sm mt-1"
                    >
                      {error}
                    </p>
                  )
              )}
            </div>
            <button
              type="button"
              onClick={handleAddSubtask}
              className="w-full text-indigo-500 border border-indigo-500 py-2 rounded-[1.5rem] hover:bg-indigo-50 transition duration-200 mb-4"
            >
              + Add New Subtask
            </button>
          </div>
 <div
        className={`w-full p-2 border border-gray-400 rounded-md bg-transparent cursor-pointer flex justify-between items-center ${errors.columnError ? "border-red-500" : "border-gray-400"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">
          {columns.find((col) => col._id === selectedColumnId)?.columnName || "Select a column"}
        </span>
        <BsChevronDown className={`w-5 h-5 text-gray-500 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`} />
      </div>
          {/* Status Dropdown */}
      {isOpen && (
        <ul className={`absolute z-10 w-96 bg-white border border-gray-300 rounded-md shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          {columns.map((column) => (
            <li
              key={column._id}
              className={`px-4 py-2 hover:bg-gray-200 cursor-pointer  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
              onClick={() => handleSelect(column._id)}
            >
              {column.columnName}
            </li>
          ))}
        </ul>
      )}

      {errors.columnError && (
        <p className="text-red-500 text-sm mt-1">{errors.columnError}</p>
      )}
    

          {/* Create Task Button */}
          <button
            onClick={handleCreateTask}
            type="button"
            className="w-full bg-indigo-500 text-white py-2 rounded-[1.5rem] hover:bg-indigo-600 transition duration-200 mt-2"
          >
            Create Task
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateTask;
