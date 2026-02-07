import chalk from "chalk";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(chalk.cyan.bold(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error: any) {
    console.error(chalk.red.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;
