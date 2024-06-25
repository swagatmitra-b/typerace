import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
import { passages } from "./passages";

configDotenv();
const app = express();
const PORT = 3000;

const getPassage = () => {
  const slot = Math.floor(Math.random() * passages.length);
  const p = passages[slot].split(" ");
  return p.flatMap((word: string, i: number) => {
    let b = word.split("");
    if (i != p.length - 1) b.push(" ");
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
let pStore: Map<string, string[]> = new Map();
let ranking: Map<string, string[]> = new Map();
let full: { [K: string]: boolean } = {};

io.on("connection", (socket) => {
  socket.on("join", async (user, room) => {
    if (!members.get(room)) {
      const p = getPassage();
      members.set(room, [user]);
      pStore.set(room, p);
      full[room] = false;
      socket.join(room);
      io.to(room).emit("join", user, [user], pStore.get(room));
      setTimeout(() => {
        io.to(room).emit("start");
        full[room] = true;
      }, 10000);
      return;
    } else {
      const current = members.get(room) as string[];
      if (current.includes(user) || current.length > 4 || full[room]) return;
      current.push(user);
      socket.join(room);
      io.to(room).emit("join", user, current, pStore.get(room));
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
  socket.on("leave", (user, room) => {
    let mem = members.get(room) as string[];
    if (mem?.includes(user)) {
      mem = mem.filter((p) => p != user);
      if (mem.length) members.set(room, mem);
      else {
        members.delete(room);
        pStore.delete(room);
        ranking.delete(room);
        delete full[room];
      }
    }
  });
});

server.listen(PORT, () => console.log("server is running on port", PORT));
