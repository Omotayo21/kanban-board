import { NextResponse } from "next/server"; 
import Task from "../../../../models/taskModel"; // Import your Task model
import { connect } from "../../../../dbConfig/dbConfig";
import Subtask from "../../../../models/subtaskModel";
import { NextRequest } from "next/server";

connect();

export async function PUT(request: NextRequest) {
  try {
  //  const { searchParams } = new URL(request.url);
    //const id = searchParams.get("id");
    const id = request.url.split('/').pop()

    // Parse the JSON body with type annotation
    const { isCompleted }: { isCompleted: boolean } = await request.json(); // Correctly parse the body

    const updatedSubtask = await Subtask.findByIdAndUpdate(
      id,
      { isCompleted: isCompleted },
      { new: true } // Return the updated subtask
    );

    if (!updatedSubtask) {
      return NextResponse.json({ message: "not found" }, { status: 404 });
    }

    console.log("success");
    return NextResponse.json(updatedSubtask, { status: 200 });
  } catch (error: any) {
    console.error("Error updating subtask:", error);
    return NextResponse.json(
      { message: "Error updating subtask", error },
      { status: 500 }
    );
  }
}
