import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

if (mongoose.models.Subtask) {
  delete mongoose.models.Subtask;
}

const Subtask = mongoose.models.Subtask || mongoose.model("Subtask", subtaskSchema);
export default Subtask;

