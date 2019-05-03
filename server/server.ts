import { Server } from "http";
import { readFileSync } from "fs";
import path from "path";

import {
  DocSet,
  change,
  init as initAutomerge,
  Text,
  Connection
} from "automerge";
import socket, { Socket } from "socket.io";

import { Doc } from "../src/Doc";

const PORT = process.env.PORT || 3001;

const initialText = readFileSync(
  path.join(__dirname, "sample-code.txt")
).toString();

// DocSet is shared, but each connection gets its own... Connection, obviously enough
const docSet = new DocSet<Doc>();
const doc = change(initAutomerge<Doc>(), "Initialize doc", d => {
  d.text = new Text();

  d.text.insertAt(0, ...initialText);
});

docSet.setDoc("main", doc);

const server = new Server();
const io = socket(server);

interface ClientState {
  name: string;
  connection: Connection;
}

const socketToClientState = new Map<Socket, ClientState>();

let counter = 0;

io.on("connection", s => {
  const name = `${(counter++).toString()}`;
  console.log(`Client connected! "${name}"`);

  const connection = new Connection(docSet, msg => {
    // console.log(`Sending message to ${name}: ${JSON.stringify(msg)}`);
    s.emit("automerge", msg);
  });

  connection.open();

  s.on("disconnect", reason => {
    console.log(`Client '${name}' disconnected! (Reason: '${reason}')`);
    connection.close();
    socketToClientState.delete(s);
  });

  s.on("automerge", msg => {
    // console.log(`receiving from ${name}: ${JSON.stringify(msg)}`);
    connection.receiveMsg(msg);
  });

  socketToClientState.set(s, {
    name,
    connection
  });
});

server.listen(PORT);
console.log(`Listening on port ${PORT}`);
