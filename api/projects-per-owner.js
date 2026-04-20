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
    const result = await Fluid.aggregate([
      {
        $group: {
          _id: "$Owner",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}