import { NextRequest, NextResponse } from "next/server";
import Task from "../../../../models/taskModel"; // Import your Task model
import { connect } from "../../../../dbConfig/dbConfig";
import Subtask from '../../../../models/subtaskModel'

connect();

export async function GET(request : NextRequest) {
 
 // const { searchParams } = new URL(request.url);
 // const columnId = searchParams.get("id");
 const columnId = request.url.split('/').pop()

  try {
    const columnId = request.url.split('/').pop()
    if(!columnId){
      return new NextResponse(
        JSON.stringify({ error: "Timestamp is required" }),
        { status: 400 }
      );
    }
    const tasks = await Task.find({ columnId }).populate("subtasks"); // Fetch tasks for the given column
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Error fetching tasks", error },
      { status: 500 }
    );
  }
}
