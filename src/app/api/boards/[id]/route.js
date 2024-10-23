
import { NextResponse } from "next/server";
import Board from "../../../../models/boardModel";
import Column from "../../../../models/columnModel";
import User from "../../../../models/userModel"; // Import User model
import { connect } from "../../../../dbConfig/dbConfig";
import { getTokenData } from "../../../../helpers/getTokenData";

// Connect to database
connect();

export async function GET(request) {
  try {
    // Get user ID from token
    const userId = await getTokenData(request); // Use 'request' instead of 'NextRequest'
    const user = await User.findOne({ _id: userId }).select("-password");
   if(!userId){throw new Error ('missing id ooo')}
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract the board ID from the request URL if available
    //const { searchParams } = new URL(request.url);
//const boardId = searchParams.get("id");
   const boardId = request.url.split('/').pop()
    
    if(!boardId){
      return new NextResponse(
        JSON.stringify({ error: "Timestamp is required" }),
        { status: 400 }
      );
    }
    if (boardId) {
      // Fetch a specific board
      if (!user.boards.includes(boardId)) {
        return NextResponse.json(
          { message: "Board not found or unauthorized" },
          { status: 404 }
        );
      }

      const board = await Board.findById(boardId).populate("columns");
      if (!board) {
        return NextResponse.json(
          { message: "Board not found" },
          { status: 404 }
        );
      }
 console.log(board);
      return NextResponse.json(board, { status: 200 });
     
    } else {
      // Fetch all boards for the user
      const boards = await Board.find({ _id: { $in: user.boards } }).populate(
        "columns"
      );

      return NextResponse.json(boards, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching boards:", error);
    return NextResponse.json(
      { message: "Error fetching boards", error },
      { status: 500 }
    );
  }
}



export async function DELETE(request) {
  try {
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

  // const { searchParams } = new URL(request.url);
  // const boardId = searchParams.get("id");
const boardId = request.url.split('/').pop()
    
    // Find the board and verify if it belongs to the user
    const board = await Board.findById(boardId);

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
export async function PUT(request) {
  try {
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    //const { searchParams } = new URL(request.url);
    //const boardId = searchParams.get("id");
    const boardId = request.url.split('/').pop()
    const { boardTitle, columns } = await request.json(); // 'columns' is now just an array of names

    // Find the board and verify if it belongs to the user
    const board = await Board.findOne({
      _id: boardId,
      _id: { $in: user.boards },
    });

    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    // Update the board title if it is provided
    if (boardTitle) {
      board.boardTitle = boardTitle;
    }

    if (columns && columns.length > 0) {
      // Fetch the existing columns from the board
      const existingColumns = await Column.find({
        _id: { $in: board.columns },
      });

      // Update each column's name using the passed names
      for (let i = 0; i < columns.length; i++) {
        const existingColumn = existingColumns[i];
        if (existingColumn) {
          existingColumn.columnName = columns[i]; // Update the name with the corresponding entry from 'columns'
          await existingColumn.save();
        }
      }
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
