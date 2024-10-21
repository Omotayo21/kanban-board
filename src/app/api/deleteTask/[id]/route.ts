import User from '../../../../models/userModel'
import { NextRequest, NextResponse } from "next/server";
import Task from "../../../../models/taskModel";
import Board from "../../../../models/boardModel";
import Column from "../../../../models/columnModel";
import Subtask from "../../../../models/subtaskModel"; // Import Subtask model

import { connect } from "../../../../dbConfig/dbConfig";
import { getTokenData } from "../../../../helpers/getTokenData";


connect()

export async function DELETE(request : NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");

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
   await task.deleteOne();


    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error : any) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Error deleting task", error: error.message || error },
      { status: 500 }
    );
  }
}
