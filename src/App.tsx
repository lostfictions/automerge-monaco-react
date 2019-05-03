import React from "react";
import { DocSet, Connection } from "automerge";
import io from "socket.io-client";

import MonacoAutomerge from "./monaco-automerge";
import { Doc } from "./Doc";

let host: string;
if (process.env.NODE_ENV === "production") {
  host = window.location.toString();
} else {
  const PROTOCOL = "http";
  const HOSTNAME = "localhost";
  const PORT = process.env.PORT || 3001;
  host = `${PROTOCOL}://${HOSTNAME}:${PORT}`;
}

let socket: SocketIOClient.Socket | null;

interface AppState {
  doc: Doc | null;
}

export default class App extends React.Component<{}, AppState> {
  readonly docSet = new DocSet<Doc>();
  connection: Connection<Doc> | null = null;

  constructor(props: {}) {
    super(props);

    socket = io.connect(host, {
      transports: ["websocket"]
    });

    socket.on("disconnect", (reason: string) => {
      console.log(`Disconnected! (Reason: '${reason}')`);
    });

    socket.on("connect", () => {
      console.log("(re)connected");

      // On every reconnect, it seems we have to build a new Connection object
      // -- we can't just open and close the existing one.
      this.connection = new Connection(this.docSet, msg => {
        console.log(
          `[${Date.now()
            .toString()
            .substr(-5)}] Sending message of length ${
            JSON.stringify(msg).length
          }`
        );
        socket!.emit("automerge", msg);
      });
      this.connection.open();

      const automergeHandler = (msg: any) => {
        console.log(
          `[${Date.now()
            .toString()
            .substr(-5)}] Receiving message of length ${
            JSON.stringify(msg).length
          }`
        );
        this.connection!.receiveMsg(msg);
      };
      socket!.on("automerge", automergeHandler);

      socket!.once("disconnect", (reason: string) => {
        console.log(`Disconnected! (Reason: '${reason}')`);
        this.connection!.close();
        socket!.off("automerge", automergeHandler);
      });
    });

    this.docSet.registerHandler((_docId, nextDoc) => {
      this.setState({
        doc: nextDoc
      });
    });

    this.state = {
      doc: null
    };
  }

  // componentDidMount() {
  //   this.connection!.open();
  // }

  // componentWillUnmount() {
  //   if (this.connection) {
  //     this.connection.close();
  //   }
  // }

  onChange: (changeHandler: () => Doc) => void = changeHandler => {
    const nextDoc = changeHandler();

    this.docSet.setDoc("main", nextDoc);
    this.setState({
      doc: nextDoc
    });
  };

  render() {
    const { doc } = this.state;

    return (
      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          overflow: "hidden"
        }}
      >
        <MonacoAutomerge value={doc} onChange={this.onChange} />
        <div
          style={{
            padding: 10,
            backgroundColor: "#211",
            color: "#ddd"
            // overflow: "hidden scroll"
          }}
        >
          i am helpful sidebar
        </div>
      </div>
    );
  }
}
