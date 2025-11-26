const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Please add it to your environment variables.");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || undefined,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

