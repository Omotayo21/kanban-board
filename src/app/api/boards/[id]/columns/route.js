import { NextResponse } from "next/server";
import Board from "../../../../../models/boardModel";
import Column from "../../../../../models/columnModel";
import Task from "../../../../../models/taskModel"; // If you have a separate Task model
import User from "../../../../../models/userModel";
import { connect } from "../../../../../dbConfig/dbConfig";
import { getTokenData } from "../../../../../helpers/getTokenData";

// Connect to the database
connect();

// POST: Add new columns with tasks to a specific board
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    //const boardId = searchParams.get("id");
    const boardId = request.url.split('/').pop()
    // Get user ID from token for authentication
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body for columns (containing columnName and tasks)
    const { columns } = await request.json();

    if (!Array.isArray(columns) || columns.length === 0) {
      return NextResponse.json(
        { message: "At least one column is required" },
        { status: 400 }
      );
    }

    // Step 1: Create the columns
    const columnDocs = await Promise.all(
      columns.map(async ({ columnName, tasks }) => {
        if (!columnName) {
          throw new Error("Column name is required");
        }

        // Create a new column document with the empty tasks array
        const newColumn = new Column({
          columnName,
          tasks: [], // Initially, tasks can be an empty array
        });

        return await newColumn.save();
      })
    );

    // Step 2: Find the board by ID and add the new columns to it
    const board = await Board.findById(boardId);

    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    // Add the new columns to the board
    board.columns.push(...columnDocs.map((col) => col._id)); // Add column IDs to the board
    await board.save();

    return NextResponse.json(
      { message: "Columns created successfully", columns: columnDocs },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating columns:", error);
    return NextResponse.json(
      { message: "Error creating columns", error: error.message || error },
      { status: 500 }
    );
  }
}
