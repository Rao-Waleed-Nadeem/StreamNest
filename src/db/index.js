import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URI}/${DB_NAME}`
    );
    console.log(
      "MongoDB Connected!! DB Host!! ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("ERROR occur during database connection: ", error);
    process.exit(1);
  }
};

export default connectDB;
