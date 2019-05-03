import { Server } from "http";
import { readFileSync } from "fs";
import path from "path";

import Automerge from "automerge";
import socket, { Socket } from "socket.io";

import { Doc } from "../src/Doc";

const PORT = process.env.PORT || 3000;

const initialText = readFileSync(
  path.join(__dirname, "sample-code.txt")
).toString();

const docSet = new Automerge.DocSet<Doc>();

const doc = Automerge.change(Automerge.init<Doc>(), "Initialize doc", d => {
  d.text = new Automerge.Text();

  d.text.insertAt(0, ...initialText);
});

docSet.setDoc("main", doc);

const server = new Server();
const io = socket(server);

const connection = new Automerge.Connection(docSet, msg => {
  console.log("sending!");
  io.emit("automerge", msg);
});

const idsBySocket = new Map<Socket, string>();

io.on("connection", s => {
  console.log(`Client connected!`);

  s.emit("init", doc);

  s.on("automerge", (msg: unknown) => {
    console.log("receiving!");
    connection.receiveMsg(msg);
  });

  // s.on("action", (action: any) => {
  //   // console.log(`got action: ${JSON.stringify(action)}. applying`);
  //   try {
  //     recv(action);
  //   } catch (e) {
  //     console.error(`Couldn't apply action ${JSON.stringify(action)}:\n`, e);
  //   }
  // });

  // s.on("id", id => {
  //   console.log(`Client identified as '${id}'`);
  //   idsBySocket.set(s, id);
  // });

  // s.on("cursor", ([x, y]: [number, number]) => {
  //   // console.log(`cursor ${idsBySocket.get(s)} = [${x},${y}]`);
  //   s.broadcast.emit("othercursor", [idsBySocket.get(s), x, y]);
  // });

  s.on("disconnect", reason => {
    console.log(
      `Client '${idsBySocket.get(s)}' disconnected! (Reason: '${reason}')`
    );
    s.removeAllListeners();
    idsBySocket.delete(s);
  });
});

server.listen(PORT);
console.log(`Listening on port ${PORT}`);
