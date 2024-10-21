import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
  columnName: { type: String, required: true }, 
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], 
});
if (mongoose.models.Column) {
  delete mongoose.models.Column;
}
const Column = mongoose.model("Column", columnSchema);
export default Column;
