import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
  columnName: { type: String, required: true }, 
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], 
});

const Column = mongoose.model("Column", columnSchema);
export default Column;
