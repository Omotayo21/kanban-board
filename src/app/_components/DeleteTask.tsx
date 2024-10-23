"use client";

import React, { useState } from "react";
import axios from "axios";
import Loader2 from "./Loader";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { setIsCreatedNewColumn } from "../redux/uiSlice";
interface DeleteTaskProps {
  taskId: string; 
  onClose: () => void;
  fetchBoard: () => void;
  closeTask: () => void;
}

const DeleteTask: React.FC<DeleteTaskProps> = ({
  taskId,
  onClose,
  fetchBoard,
  closeTask,
}) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean> (false);
  const {darkMode} = useAppSelector((state) => state.ui);
  const handleDelete = async () => {
    setLoading(true);
    try {
      // Make the delete request to the backend
      await axios.delete(`/api/deleteTask/${taskId}?id=${taskId}`);

      onClose();
      fetchBoard();
      closeTask();
      dispatch(setIsCreatedNewColumn(true))
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader2 />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`p-6 rounded-md w-full max-w-md ${darkMode ? "bg-gray-800 text-white" : 'bg-white text-black'}` }>
        <h2 className="text-2xl font-bold mb-4 text-red-500">Delete Task</h2>
        <p className="mb-6">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 p-2 rounded-md text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 p-2 rounded-md text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;
