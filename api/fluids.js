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

  try {
    const data = await Fluid.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}