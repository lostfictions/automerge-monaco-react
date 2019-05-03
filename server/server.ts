// import path from "path";
import { Server } from "http";

import socket, { Socket } from "socket.io";

const PORT = process.env.PORT || 3000;

const server = new Server();
const io = socket(server);

server.listen(PORT);

// const { tree: m, recv } = serverSync({
//   model: Model,
//   send: async patch => {
//     // console.log(`sending patch: ${JSON.stringify(patch)}`);

//     // simulate network latency
//     // await new Promise(res => setTimeout(() => res(), 2000));

//     io.emit("patch", patch);
//   }
// });

const idsBySocket = new Map<Socket, string>();

io.on("connection", s => {
  console.log(`Client connected!`);

  s.emit("init", { hello: "world" });
  // s.emit("init", getSnapshot(m));

  // s.on("action", (action: any) => {
  //   // console.log(`got action: ${JSON.stringify(action)}. applying`);
  //   try {
  //     recv(action);
  //   } catch (e) {
  //     console.error(`Couldn't apply action ${JSON.stringify(action)}:\n`, e);
  //   }
  // });

  s.on("id", id => {
    console.log(`Client identified as '${id}'`);
    idsBySocket.set(s, id);
  });

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

console.log(`Listening on port ${PORT}`);
