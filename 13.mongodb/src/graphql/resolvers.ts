import { Todo } from "../models/todo.model.js";
import { IUser } from "../models/user.model.js";

interface Context {
  user?: IUser;
}

export const resolvers = {
  Query: {
    getTodos: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new Error("Not authenticated");
      return await Todo.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate("user");
    },
    getTodo: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user) throw new Error("Not authenticated");
      return await Todo.findOne({ _id: id, user: user._id }).populate("user");
    },
    me: (_: any, __: any, { user }: Context) => user,
  },
  Mutation: {
    addTodo: async (_: any, { task }: { task: string }, { user }: Context) => {
      if (!user) throw new Error("Not authenticated");
      const todo = await Todo.create({ task, user: user._id });
      return await todo.populate("user");
    },
    toggleTodo: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user) throw new Error("Not authenticated");
      const todo = await Todo.findOne({ _id: id, user: user._id });
      if (!todo) throw new Error("Todo not found");
      todo.completed = !todo.completed;
      await todo.save();
      return await todo.populate("user");
    },
    deleteTodo: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user) throw new Error("Not authenticated");
      const result = await Todo.deleteOne({ _id: id, user: user._id });
      return result.deletedCount === 1;
    },
  },
};
