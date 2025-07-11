// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
 
const app = express();


const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// MongoDB Connections
mongoose.connect(process.env.MONGO_DB_USER)
  .then(() => console.log("Connected to USER database"))
  .catch(err => console.log("User DB Error:", err));

mongoose.createConnection(process.env.MONGO_DB_MSG)
  .on('connected', () => console.log("Connected to MSG database"))
  .on('error', (err) => console.log("Msg DB Error:", err));

// Routes
app.use("/api", authRoutes);
app.use("/msg", messageRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
