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
    `https://random-word-api.vercel.app/api?words=2&length=${4}`
  ).then((res) => res.json());
  return data.flatMap((word: string, i: number) => {
    let b = word.split("");
    if (i != data.length - 1) b.push(" ");
    return b;
  });
};

app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${process.env.CLIENT_URL}`,
    methods: "GET",
  },
});

let members: Map<string, string[]> = new Map();
let passage: Map<string, string[]> = new Map();
let ranking: Map<string, string[]> = new Map();

io.on("connection", (socket) => {
  socket.on("join", async (user, room) => {
    console.log(user, room);
    if (!members.get(room)) {
      const p = await fetchWords();
      members.set(room, [user]);
      passage.set(room, p);
      socket.join(room);
      io.to(room).emit("join", user, [user], passage.get(room));
      setTimeout(() => {
        io.to(room).emit("start");
      }, 1000);
      return;
    } else {
      const current = members.get(room) as string[];
      if (current.includes(user) || current.length > 4) return;
      current.push(user);
      socket.join(room);
      io.to(room).emit("join", user, current, passage.get(room));
    }
  });
  socket.on("type", (user, room, typeData) => {
    io.to(room).emit("typing", user, typeData);
  });
  socket.on("finish", (user, room, wpm) => {
    if (!ranking.get(room)) {
      ranking.set(room, [user]);
      io.to(room).emit("result", user, 1, wpm);
    } else {
      const len = ranking.get(room) as string[];
      len.push(user);
      io.to(room).emit("result", user, len.length, wpm);
    }
  });
});

server.listen(PORT, () => console.log("server is running on port", PORT));
