import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  user: mongoose.Types.ObjectId;
  task: string;
  completed: boolean;
}

const todoSchema = new Schema<ITodo>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Todo = mongoose.model<ITodo>("Todo", todoSchema);
