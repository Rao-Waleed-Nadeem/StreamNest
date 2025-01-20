import mongoose from "mongoose";

const googleUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate users
      lowercase: true, // Converts email to lowercase
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the GoogleUser model
const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);

export { GoogleUser };
