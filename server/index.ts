import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();
const PORT = 3000;

export const fetchWords = async (): Promise<string[]> => {
  const data = await fetch(
    `https://random-word-api.vercel.app/api?words=50&length=${4}`
  ).then((res) => res.json());
  return data.flatMap((word: string, i: number) => {
    let b = word.split("");
    if (i != data.length) b.push(" ");
    return b;
  });
};

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
let passage: Map<string, string[]> = new Map();

io.on("connection", (socket) => {
  socket.on("join", async (room, user) => {
    console.log(room, user);
    if (!members.get(room)) {
      const p = await fetchWords();
      members.set(room, [user]);
      passage.set(room, p.splice(0, 8));
      socket.join(room);
      io.to(room).emit("join", user, [user], passage.get(room));
      io.to(room);
      setTimeout(() => {
        io.to(room).emit("start");
      }, 1000);
      return;
    } else {
      const current = members.get(room) as string[];
      if (current.includes(user)) return;
      current.push(user);
      socket.join(room);
      io.to(room).emit("join", user, current, passage.get(room));
    }
  });
  socket.on("type", (user, room, typeData) => {
    io.to(room).emit("typing", user, typeData);
  });
});

server.listen(PORT, () => console.log("server is running on port", PORT));
