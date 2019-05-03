import React from "react";
import Automerge from "automerge";

import MonacoAutomerge, { Doc } from "./monaco-automerge";

const initialText: string =
  "// type your code...\nfunction frig() { console.log('hi') }";

interface AppState {
  doc1: Doc;
  doc2: Doc;
  changes1: string[];
  changes2: string[];
}

function getChangelog(doc: Doc): string[] {
  return Automerge.getHistory(doc).map(state => state.change.message);
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    const emptyDoc = Automerge.init<Doc>();

    const doc1 = Automerge.change(emptyDoc, "Initialize doc", doc => {
      doc.text = new Automerge.Text();

      doc.text.insertAt(0, ...initialText);
    });

    const doc2 = Automerge.merge(Automerge.init<Doc>(), doc1);

    this.state = {
      doc1,
      doc2,
      changes1: getChangelog(doc1),
      changes2: getChangelog(doc2)
    };
  }
  onChange1: (changeHandler: (prev: Doc) => Doc) => void = changeHandler => {
    const nextDoc = changeHandler(this.state.doc1);

    this.setState({
      doc1: nextDoc,
      changes1: getChangelog(nextDoc)
    });
  };
  onChange2: (changeHandler: (prev: Doc) => Doc) => void = changeHandler => {
    const nextDoc = changeHandler(this.state.doc2);

    this.setState({
      doc2: nextDoc,
      changes1: getChangelog(nextDoc)
    });
  };

  merge = () => {
    this.setState(({ doc1, doc2 }) => {
      return {
        doc1: Automerge.merge(doc1, doc2),
        doc2: Automerge.merge(doc2, doc1)
      };
    });
  };

  render() {
    const { doc1, doc2, changes1, changes2 } = this.state;

    return (
      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          overflow: "hidden"
        }}
      >
        <MonacoAutomerge value={doc1} onChange={this.onChange1} />
        <MonacoAutomerge value={doc2} onChange={this.onChange2} />
        <div
          style={{
            padding: 10,
            backgroundColor: "#211",
            color: "#ddd"
            // overflow: "hidden scroll"
          }}
        >
          <button onClick={this.merge}>merge</button>
          {/* <div>{changes1.join("\n")}</div>
          <div>{changes2.join("\n")}</div> */}
        </div>
      </div>
    );
  }
}
