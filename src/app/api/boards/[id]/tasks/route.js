import { NextResponse } from "next/server";
import Task from "../../../../../models/taskModel";
import Board from "../../../../../models/boardModel";
import Column from "../../../../../models/columnModel";
import Subtask from "../../../../../models/subtaskModel"; // Import Subtask model
import User from "../../../../../models/userModel";
import { connect } from "../../../../../dbConfig/dbConfig";
import { getTokenData } from "../../../../../helpers/getTokenData";

// Connect to the database
connect();

export async function POST(request) {
  try {
   // const { searchParams } = new URL(request.url);
    //const columnId = searchParams.get("columnId");
    //const boardId = searchParams.get("boardId");
    const url = request.url;

    // Split the URL into parts based on "/"
    const urlParts = url.split('/');

    // Extract boardId from the second-to-last part of the URL
    const boardId = urlParts[urlParts.length - 2]; // Assuming boardId is in the second-to-last position

    // Extract query parameters from the URL (after "?")
    const queryParams = url.split('?')[1]; // Get the part after "?"
    const params = new URLSearchParams(queryParams);

    // Extract columnId from query params
    const columnId = params.get('columnId');

    console.log("Board ID from path:", boardId);
    console.log("Column ID:", columnId);
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get task details including optional subtasks
    const { title, description, status, subtasks = [] } = await request.json();

    if (!title || !status || !columnId) {
      return NextResponse.json(
        { message: "Title, status, and column ID are required" },
        { status: 400 }
      );
    }

    // Step 1: Create the task
    const newTask = new Task({
      title,
      description,
      status,
      subtasks,
      columnId
    });

   // await newTask.save();

   const subtaskDocs = await Promise.all(
     subtasks.map(async (subtask) => {
       const newSubtask = new Subtask({
         title: subtask.title,
         task: newTask._id,
         isCompleted: subtask.isCompleted || false,
       });
       return await newSubtask.save();
     })
   );

   // After saving the subtasks, update the task's subtasks array with the new subtask IDs
   newTask.subtasks = subtaskDocs.map((subtask) => subtask._id);
   await newTask.save();

    // Step 3: Find the column by ID and update its tasks array
    const column = await Column.findById(columnId);
    if (!column) {
      return NextResponse.json(
        { message: "Column not found" },
        { status: 404 }
      );
    }

    // Push the full new task object to the column's tasks array
    column.tasks.push(newTask._id); // Change from newTask._id to newTask
    await column.save();

    // Step 4: Optionally update the board's columns if necessary
    const board = await Board.findById(boardId);
    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Task and subtasks created successfully",
        task: newTask,
        subtasks: subtaskDocs,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task and subtasks:", error);
    return NextResponse.json(
      {
        message: "Error creating task and subtasks",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");
    const taskId = searchParams.get("taskId");

    // Authenticate user
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, status, subtasks = [] } = await request.json();

    // Find the board and task
    const board = await Board.findById(boardId);
    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    //const task = await Task.findOne({ _id: taskId, board: boardId });
const task = await Task.findById(taskId);

    console.log("Found task:", task); 
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    // Update subtasks if provided
    if (subtasks.length > 0) {
      // Remove existing subtasks associated with this task
      await Subtask.deleteMany({ task: task._id });

      // Create new subtasks and associate them with the task
      const subtaskDocs = await Promise.all(
        subtasks.map(async (subtask) => {
          const newSubtask = new Subtask({
            title: subtask.title,
            task: task._id,
            isCompleted: subtask.isCompleted || false,
          });
          return await newSubtask.save();
        })
      );

      // Save the updated subtasks to the task
      task.subtasks = subtaskDocs.map((subtask) => subtask._id);
    }

    // Save the updated task
    const updatedTask = await task.save();

    // Respond with the updated task
    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Error updating task", error: error.message || error },
      { status: 500 }
    );
  }
}

// DELETE: Delete a task by its ID
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Delete associated subtasks
    await Subtask.deleteMany({ task: task._id });

    // Remove the task from the column
    const column = await Column.findById(task.columnId);
    if (column) {
      column.tasks = column.tasks.filter(
        (id) => id.toString() !== task._id.toString()
      );
      await column.save();
    }

    // Delete the task
    await task.remove();

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Error deleting task", error: error.message || error },
      { status: 500 }
    );
  }
}