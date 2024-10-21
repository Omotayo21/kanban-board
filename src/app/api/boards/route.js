import { NextRequest, NextResponse } from "next/server";
import Board from "../../../models/boardModel";
import Column from "../../../models/columnModel";
import User from "../../../models/userModel"; // Import User model
import { connect } from "../../../dbConfig/dbConfig";
import { getTokenData } from "../../../helpers/getTokenData";

// Connect to database
connect();

// POST: Create a new board for the authenticated user
export async function POST(request ) {
  try {
    // Get user ID from token
    const userId = await getTokenData(request); // Use 'request' instead of 'NextRequest'
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { boardTitle, columns } = await request.json();

    // Step 1: Create Column documents
    const columnDocs = await Promise.all(
      columns.map(async (columnName) => {
        const column = new Column({ columnName });
        return await column.save();
      })
    );

    // Step 2: Create the Board with references to the created Column documents
    const board = new Board({
      boardTitle,
      columns: columnDocs.map((col) => col._id), // Reference the column IDs
    });

    // Save the board
    const savedBoard = await board.save();

    // Step 3: Add board to the user's boards
    user.boards.push(savedBoard._id);
    await user.save();

    return NextResponse.json(savedBoard, { status: 201 });
  } catch (error) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { message: "Error creating board", error },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch all boards that belong to the user and populate their columns
    const boards = await Board.find({ _id: { $in: user.boards } }).populate(
      "columns"
    );

    return NextResponse.json(boards, { status: 200 });
  } catch (error) {
    console.error("Error fetching boards:", error);
    return NextResponse.json(
      { message: "Error fetching boards", error },
      { status: 500 }
    );
  }
}



// PUT: Edit a board by its ID
export async function PUT(request) {
  try {
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { boardId, boardTitle, columns } = await request.json();

    // Find the board and verify if it belongs to the user
    const board = await Board.findOne({
      _id: boardId,
      _id: { $in: user.boards },
    });

    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    // Update board details
    if (boardTitle) board.boardTitle = boardTitle;

    if (columns && columns.length > 0) {
      // Delete old columns if needed, and create new ones
      await Column.deleteMany({ _id: { $in: board.columns } });
      const newColumns = await Promise.all(
        columns.map(async (columnName) => {
          const column = new Column({ columnName });
          return await column.save();
        })
      );
      board.columns = newColumns.map((col) => col._id);
    }

    const updatedBoard = await board.save();

    return NextResponse.json(updatedBoard, { status: 200 });
  } catch (error) {
    console.error("Error updating board:", error);
    return NextResponse.json(
      { message: "Error updating board", error },
      { status: 500 }
    );
  }
}

// DELETE: Delete a board by its ID
export async function DELETE(request) {
  try {
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { boardId } = await request.json();

    // Find the board and verify if it belongs to the user
    const board = await Board.findOne({
      _id: boardId,
      _id: { $in: user.boards },
    });

    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    // Delete board and associated columns
    await Column.deleteMany({ _id: { $in: board.columns } });
    await board.deleteOne();

    // Remove the board from the user's list
    user.boards = user.boards.filter((id) => id.toString() !== boardId);
    await user.save();

    return NextResponse.json(
      { message: "Board deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting board:", error);
    return NextResponse.json(
      { message: "Error deleting board", error },
      { status: 500 }
    );
  }
}
