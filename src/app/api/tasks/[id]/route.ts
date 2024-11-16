import { NextRequest, NextResponse } from "next/server";
import Task from "../../../../models/taskModel";
import { connect } from "../../../../dbConfig/dbConfig";
import Subtask from '../../../../models/subtaskModel';

connect()
export async function GET(request: NextRequest) {
   
  const columnId = request.url.split('/').pop();

  try {
    if (!columnId) {
      return new NextResponse(
        JSON.stringify({ error: "Column ID is required" }),
        { status: 400 }
      );
    }
    
    const tasks = await Task.find({columnId}).populate({path: "subtasks"}).lean();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Error fetching tasks", error },
      { status: 500 }
    );
  }
}
