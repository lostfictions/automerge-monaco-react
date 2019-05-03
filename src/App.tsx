import React from "react";
import Automerge from "automerge";
import io from "socket.io-client";

import MonacoAutomerge from "./monaco-automerge";
import { Doc } from "./Doc";

let host: string;
if (process.env.NODE_ENV === "production") {
  host = window.location.toString();
} else {
  const PROTOCOL = "http";
  const HOSTNAME = "localhost";
  const PORT = process.env.PORT || 3000;
  host = `${PROTOCOL}://${HOSTNAME}:${PORT}`;
}

const socket = io.connect(host, {
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("socket connected!");
});

socket.on("disconnect", (reason: string) => {
  console.log(`Disconnected! (Reason: '${reason}')`);
});

// socket.on("init", console.log);
// const doc = Automerge.change(, "Initialize doc", d => {
//   d.text = new Automerge.Text();

//   d.text.insertAt(0, ...initialText);
// });

interface AppState {
  docSet: Automerge.DocSet<Doc>;
}

// function getChangelog(doc: Doc): string[] {
//   return Automerge.getHistory(doc).map(state => state.change.message);
// }

export default class App extends React.Component<{}, AppState> {
  connection: Automerge.Connection<Doc>;

  constructor(props: {}) {
    super(props);

    const docSet = new Automerge.DocSet<Doc>();
    docSet.setDoc("main", Automerge.init<Doc>());

    const connection = new Automerge.Connection(docSet, msg => {
      console.log("sending!");
      socket.emit("automerge", msg);
    });

    socket.on("automerge", (msg: unknown) => {
      console.log("receiving!");
      connection.receiveMsg(msg);
      this.forceUpdate();
    });

    this.state = {
      docSet
    };

    this.connection = connection;
  }

  componentDidMount() {
    this.connection.open();
  }

  componentWillUnmount() {
    this.connection.close();
  }

  onChange: (changeHandler: () => Doc) => void = changeHandler => {
    const nextDoc = changeHandler();

    this.state.docSet.setDoc("main", nextDoc);
    this.forceUpdate();
  };

  render() {
    const { docSet } = this.state;
    const doc = docSet.getDoc("main");

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
          {/* <button onClick={this.merge}>merge</button> */}
        </div>
      </div>
    );
  }
}
