import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  boardTitle: { type: String, required: true },
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }], 
});

const Board = mongoose.model("Board", boardSchema);
export default Board;
