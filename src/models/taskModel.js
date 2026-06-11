import { Schema, model } from "mongoose"

const taskSchema = new Schema({
  subject: { type: String, required: true },
  description: { type: String, default: "" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date, default: null },
  completed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
  versionKey: false,
  timestamps: true
})

const Task = model("Task", taskSchema)

export { Task }