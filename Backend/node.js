// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Load env vars
dotenv.config();
console.log("SECRET_KEY loaded ->", process.env.SECRET_KEY); // ✅ Confirm this shows value

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import MSG from "./models/message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connections
mongoose.connect(process.env.MONGO_DB_USER)
  .then(() => console.log("✅ Mongo USER connected"))
  .catch(err => console.error("USER DB Error:", err));

mongoose.createConnection(process.env.MONGO_DB_MSG)
  .on("connected", () => console.log("✅ Mongo MSG connected"))
  .on("error", err => console.error("MSG DB Error:", err));

// Routes
app.use("/api", authRoutes);
app.use("/msg", messageRoutes);

// WebSocket Auth
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token provided"));

  try {
    socket.user = jwt.verify(token, process.env.SECRET_KEY);
    return next();
  } catch (err) {
    return next(new Error("Invalid / expired token"));
  }
});

io.on("connection", (socket) => {
  console.log(`🔌 ${socket.user.email} connected (${socket.id})`);

  socket.on("chat:message", async ({ text }) => {
    if (!text?.trim()) return;
    const msgDoc = await MSG.create({ text, email: socket.user.email });
    io.emit("chat:message", {
      id: msgDoc._id,
      text,
      email: socket.user.email
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${socket.user.email} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 REST + WebSocket up on http://localhost:${PORT}`);
});
