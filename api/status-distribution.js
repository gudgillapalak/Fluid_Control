import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  const db = await mongoose.connect(MONGO_URI);
  isConnected = db.connections[0].readyState;
}

const Fluid = mongoose.models.Fluid || mongoose.model("Fluid", {}, "fluids");

export default async function handler(req, res) {
  await connectDB();

  const result = await Fluid.aggregate([
    { $group: { _id: "$Status", count: { $sum: 1 } } }
  ]);

  res.status(200).json(result);
}