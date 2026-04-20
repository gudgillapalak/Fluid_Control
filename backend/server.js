import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection (ONLY ONE)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error ❌", err));

// 📦 Use existing collection (ONLY ONE)
const Fluid = mongoose.model("Fluid", {}, "fluids");

// ================== APIs ==================

// 1. Get all data
app.get("/api/fluids", async (req, res) => {
  try {
    const data = await Fluid.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Status Distribution
app.get("/api/status-distribution", async (req, res) => {
  const result = await Fluid.aggregate([
    {
      $group: {
        _id: "$Status",
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(result);
});

// 3. Projects per Owner
app.get("/api/projects-per-owner", async (req, res) => {
  const result = await Fluid.aggregate([
    {
      $group: {
        _id: "$Owner",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);
  res.json(result);
});

// 4. Projects by Category
app.get("/api/projects-by-category", async (req, res) => {
  const result = await Fluid.aggregate([
    {
      $group: {
        _id: "$Category",
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(result);
});

// ================= AUTH =================

// TEST
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// SEED USERS
app.get("/seed", async (req, res) => {
  try {
    await User.deleteMany();

    await User.insertMany([
      {
        name: "Admin",
        email: "admin@company.com",
        password: await bcrypt.hash("Admin@123", 10),
        role: "super_admin",
      },
      {
        name: "Manager",
        email: "manager@company.com",
        password: await bcrypt.hash("Manager@123", 10),
        role: "manager",
      },
      {
        name: "Employee",
        email: "employee@company.com",
        password: await bcrypt.hash("Employee@123", 10),
        role: "employee",
      },
    ]);

    res.send("Users seeded ✅");
  } catch (err) {
    res.send("Error seeding");
  }
});

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.json({ message: "User registered ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password ❌" });
    }

    res.json({
      message: "Login successful ✅",
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 START SERVER (ONLY ONE)
const PORT = 5000;
app.listen(PORT, () => {
  console.log("✅ Server running on http://localhost:5000");
});