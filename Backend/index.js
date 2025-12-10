import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import MSG from "./models/message.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// SOCKET.IO SETUP (with env)

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN,
    methods: ["GET", "POST"],
  },
});



// PORT
const PORT = process.env.PORT || 7000;

// DATABASE CONNECTIONS
// User DB
mongoose
  .connect(process.env.MONGO_DB_USER)
  .then(() => console.log("✅ Mongo USER connected"))
  .catch((err) => console.error("USER DB Error:", err));

// Message DB
const messageDB = mongoose.createConnection(process.env.MONGO_DB_MSG);
messageDB.on("connected", () => console.log("✅ Mongo MSG connected"));
messageDB.on("error", (err) => console.error("MSG DB Error:", err));

// MIDDLEWARE
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());


// ROUTES
app.use("/api", authRoutes);
app.use("/msg", messageRoutes);


// SOCKET AUTH MIDDLEWARE
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    socket.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
});

// SOCKET EVENTS
io.on("connection", async (socket) => {
  console.log(`🔌 ${socket.user.email} connected (${socket.id})`);

  // Send chat history
  const history = await MSG.find().sort({ createdAt: 1 });
  socket.emit("chat:history", history);

  // New message event
  socket.on("chat:message", async ({ text }) => {
    if (!text?.trim()) return;

    const msgDoc = await MSG.create({
      text,
      email: socket.user.email,
    });

    io.emit("chat:message", {
      id: msgDoc._id,
      text: msgDoc.text,
      email: msgDoc.email,
      timestamp: msgDoc.createdAt,
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${socket.user.email} disconnected`);
  });
});

// START SERVER
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on port ${PORT}`);
});
