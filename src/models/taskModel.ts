import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subtask" }], 
  status: { type: mongoose.Schema.Types.ObjectId, ref: "Column" }, 
  columnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Column",
    required: true,
  },
});



const Task = mongoose.model("Task", taskSchema);
export default Task;
