import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  boardTitle: { type: String, required: true },
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }], 
});
if (mongoose.models.Board) {
  delete mongoose.models.Board;
}
const Board = mongoose.model("Board", boardSchema);
export default Board;
