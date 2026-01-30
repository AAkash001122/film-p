const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// DNS fix
const dns = require("node:dns/promises");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("Backend chal raha hai! 🔥 Go to /api/movies");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log("MongoDB connected bhai 🔥");

    // ✅ ROUTES LOAD HERE
    app.use("/api/movies", require("./routes/movies"));
    app.use("/api/reels", require("./routes/reels")); // ✅ FIXED

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
