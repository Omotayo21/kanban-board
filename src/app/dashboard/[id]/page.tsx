"use client";
import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../_components/Navbar";
import Sidebar from "../../_components/Sidebar";
import EditTask from "../../_components/EditTask";
import DeleteTask from "../../_components/DeleteTask";
import CreateColumn from "../../_components/CreateColumn";
import { BsThreeDotsVertical } from "react-icons/bs";
import Loader2 from "../../_components/Loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Subtask {
  _id: string;
  isCompleted: boolean;
  title: string;
}

interface Task {
  _id: string;
  subtasks: Subtask[];
  title: string;
  description: string;
  status: any;
}

interface Column {
  _id: string;
  columnName: string;
}

interface Board {
  _id: string;
  boardTitle: string;
  columns: Column[];
}

// Redux state type
interface RootState {
  ui: {
    darkMode: boolean;
    isCreatedNewColumn: boolean;
  };
}

// Utility function to get random color
const colors = ["blue", "red", "purple", "green", "orange", "gray"];
const getRandomColor = (): string =>
  colors[Math.floor(Math.random() * colors.length)];

// Fetch board data using React Query
const fetchBoardById = async (id: string): Promise<Board> => {
  const response = await fetch(`/api/boards/${id}?id=${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch board");
  }
  return await response.json();
};

// Fetch tasks by column ID using React Query
const fetchTasksByColumnId = async (columnId: string) => {
  const response = await fetch(`/api/tasks/${columnId}?id=${columnId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const tasks = await response.json();
  return { columnId, tasks };
};

interface BoardPageProps {
  params: {
    id: string;
  };
}

const BoardPage: React.FC<BoardPageProps> = ({ params }) => {
  const boardId = params.id;
  const queryClient = useQueryClient();
  const { darkMode, isCreatedNewColumn } = useSelector(
    (state: RootState) => state.ui
  );
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);

  // Fetch board data
  const {
    data: board,
    isLoading,
    error,
    refetch,
  } = useQuery<Board>({ queryKey: ["board", boardId], queryFn: () => fetchBoardById(boardId), 
    enabled: !!boardId,
  });

  // Fetch tasks data
  const { data: tasksData, isLoading: isTasksLoading, refetch: refetchTasks } = useQuery({
    queryKey:["tasks", board?.columns?.map((col) => col._id)],
    queryFn: async () => {
      if (board?.columns) {
        const tasksPromises = board.columns.map((col) =>
          fetchTasksByColumnId(col._id)
        );
        return await Promise.all(tasksPromises);
      }
    },
     enabled: !!board?.columns }
  );

  // Close modals when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelectedTask(null);
        setIsOptionsOpen(false);
      }
    };
    // @ts-ignore
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // @ts-ignore
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCreateColumn = () => {
    setIsCreatingColumn(true);
  };

  const handleSubtaskToggle = (subtaskId: string, isCompleted: boolean) => {
    setSelectedTask((prevTask) => {
      if (!prevTask) return null;
      const updatedSubtasks = prevTask.subtasks.map((subtask) =>
        subtask._id === subtaskId
          ? { ...subtask, isCompleted: !isCompleted }
          : subtask
      );
      return { ...prevTask, subtasks: updatedSubtasks };
    });
    // Call API to update backend
    handleCheckboxChange(subtaskId, !isCompleted);
  };

  const handleCheckboxChange = async (
    subtaskId: string,
    isCompleted: boolean
  ) => {
    try {
      await fetch(`/api/subtasks/${subtaskId}?id=${subtaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      refetch();
      refetchTasks(); // Refetch board after subtask update
    } catch (error) {
      console.error("Failed to update subtask", error);
    }
  };

  // Loader and error handling
  if (isLoading) {
    return <Loader2 />;
  }

  if (error) {
    return (
      <div className="text-center mt-2 text-red-500">
        Failed to load board data
      </div>
    );
  }

  if (!board) {
    return <div className="text-center mt-2 text-red-500">Board not found</div>;
  }
if(isCreatedNewColumn){
  refetch()
  refetchTasks()
}
  return (
    <div
      className={`h-screen flex flex-col p-4 ${
        darkMode ? "bg-gray-800 text-white" : "bg-[#F4F7FD] text-[#20212c]"
      }`}
    >
      <Navbar activeBoardId={boardId} refetch={refetch} />
      <Sidebar activeBoardId={boardId} />
      <div className="flex-1 lg:ml-[280px] mt-[72px] overflow-auto h-[calc(100vh-64px)] p-1">
        <div className="flex gap-4 h-full overflow-x-auto">
          {board?.columns?.length > 0 ? (
            board.columns.map((column) => (
              <div
                key={column._id}
                className="min-w-[300px] flex flex-col p-4 rounded-lg"
              >
                <div className="flex items-center p-4">
                  <div
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: getRandomColor() }}
                  ></div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    {column.columnName} (
                    {tasksData?.find((t) => t.columnId === column._id)?.tasks
                      .length || 0}
                    )
                  </h3>
                </div>
                <div className="flex-1 p-4 overflow-auto">
                  {tasksData?.find((t) => t.columnId === column._id)?.tasks
                    .length > 0 ? (
                    tasksData
                      ?.find((t) => t.columnId === column._id)
                      ?.tasks.map((task: Task) => (
                        <div
                          key={task._id}
                          className={`p-4 mb-2 rounded-lg shadow-md font-semibold text-start cursor-pointer hover:text-indigo-500 ${
                            darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-black"
                          }`}
                          onClick={() => handleTaskClick(task)}
                        >
                          {task.title}
                          <p className="text-gray-600 text-sm mt-2">
                            {
                              task.subtasks.filter(
                                (subtask) => subtask.isCompleted
                              ).length
                            }{" "}
                            of {task.subtasks.length} subtasks{" "}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 italic">No tasks available</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No columns available</p>
          )}
          <div
            onClick={handleCreateColumn}
            className="min-w-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition sm:w-[20rem]"
          >
            <p className="text-gray-500 font-bold text-2xl mb-8">
              + New Column
            </p>
          </div>
        </div>
        {isCreatingColumn && (
          <CreateColumn
            onClose={() => setIsCreatingColumn(false)}
            boardId={boardId}
            existingColumns={board?.columns || []}
            refetch={refetch}
            boardTitle={board?.boardTitle || ""}
          />
        )}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-20 bg-gray-800 bg-opacity-50 flex flex-row items-center justify-center">
          <div
            ref={modalRef}
            className={`p-6 rounded-lg shadow-lg lg:w-[400px] ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <div className="flex flex-row justify-between">
              <h2 className="text-xl font-bold mb-4">{selectedTask.title}</h2>
              <BsThreeDotsVertical
                size={20}
                className="text-[1rem] text-gray-400"
                onClick={() => setIsOptionsOpen((prev) => !prev)}
              />
            </div>
            {isOptionsOpen && (
              <div
                ref={optionsRef}
                className="absolute flex w-full flex-col gap-[0.6rem] p-[0.6rem] z-60 ml-48 shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] sm:w-[12rem] transition-all duration-300 ease-in-out"
              >
                <p
                  onClick={() => setShowEditBoard(true)}
                  className="cursor-pointer text-[1rem] font-medium text-[#828fa3]"
                >
                  Edit Task
                </p>
                <p
                  onClick={() => setShowDeleteModal(true)}
                  className="cursor-pointer text-[1rem] font-medium text-[#ea5555]"
                >
                  Delete Task
                </p>
              </div>
            )}
            {showEditBoard && (
              <EditTask
                taskId={selectedTask._id}
                onClose={() => setShowEditBoard(false)}
                boardId={boardId}
                taskData={selectedTask}
                columns={board?.columns || []}
                refetch={refetch}
                onCloseSelectedTask={() => setSelectedTask(null)}
              />
            )}
            {showDeleteModal && (
              <DeleteTask
                taskId={selectedTask._id}
                onClose={() => setShowDeleteModal(false)}
                fetchBoard={refetch }
                closeTask={() => setSelectedTask(null)}
              />
            )}
            <p className="text-gray-500">{selectedTask.description}</p>
            <p className="text-md mt-4 font-semibold">
              Subtasks ({selectedTask.subtasks.length})
            </p>
            <ul>
              {selectedTask.subtasks.map((subtask) => (
                <li
                  key={subtask._id}
                  className="mt-2 flex items-center w-full m-2 rounded-md bg-gray-400 p-4"
                >
                  <input
                    type="checkbox"
                    checked={subtask.isCompleted}
                    onChange={() =>
                      handleSubtaskToggle(subtask._id, subtask.isCompleted)
                    }
                  />
                  <span
                    className={`${
                      subtask.isCompleted ? "line-through" : ""
                    } text-sm ml-4`}
                  >
                    {subtask.title}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <label className="block text-sm font-semibold mt-4 mb-2">
                Current Status
              </label>
              <input
                type="text"
                value={
                  board?.columns?.find((col) => col._id === selectedTask.status)
                    ?.columnName || "Unknown Status"
                }
                readOnly
                className="p-2 border rounded-md w-full bg-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
