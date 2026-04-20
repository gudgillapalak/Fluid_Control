import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ["super_admin", "manager", "employee"],
    default: "employee",
  },
});

export default mongoose.model("User", userSchema);