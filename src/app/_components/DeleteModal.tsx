'use client'
import React, {useState} from "react";
import axios from "axios";
import Loader2 from "./Loader";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../redux/hook";
interface DeleteModalProps {
  activeBoardId: string; 
  onClose: () => void;
  fetchBoard: () => void;
  onConfirm: () => void;
}

const DeleteModal :React.FC<DeleteModalProps> = ({ onConfirm, onClose, fetchBoard, activeBoardId }) => {
   const [loading, setLoading] = useState<boolean>(false);
   const { darkMode } = useAppSelector((state) => state.ui);
   const router = useRouter();
 const handleDelete = async () => {
  setLoading(true);
   try {
     
     await axios.delete(`/api/boards/${activeBoardId}?id=${activeBoardId}`);

    
     fetchBoard();
     
     onConfirm();
     router.push('/dashboard');
   } catch (error) {
     console.error("Error deleting task:", error);
     // Handle error appropriately (e.g., show error notification)
   } finally {
     setLoading(false);
   }
 };

 if (loading) {
   return <Loader2 />;
 }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`p-6 rounded-md w-full max-w-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 text-red-500">Delete Board</h2>
        <p className="mb-6">
          Are you sure you want to delete this board? This action cannot be
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

export default DeleteModal;
