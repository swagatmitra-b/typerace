import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();
const PORT = 3000;

app.use(cors());

const server = createServer(app);
// console.log(process.env.CLIENT_URL);
const io = new Server(server, {
  cors: {
    // origin: process.env.CLIENT_URL,
    origin: "http://localhost:5173",
    methods: "GET",
  },
});

const members: Map<string, string[]> = new Map();

io.on("connection", (socket) => {
  socket.on("join", (room, user) => {
    console.log(room, user);
    if (!members.get(room)) {
      members.set(room, [user]);
      socket.join(room);
      io.to(room).emit("join", user, [user]);
      return;
    } else {
      const current = members.get(room) as string[];
      if (current.includes(user)) return;
      current.push(user);
      socket.join(room);
      io.to(room).emit("join", user, current);
    }
  });
  socket.on("type", (user, room, typeData) => {
    io.to(room).emit("typing", user, typeData);
  });
});

server.listen(PORT, () => console.log("server is running on port", PORT));
