import React from "react";

import MonacoEditor from "react-monaco-editor";
import Automerge from "automerge";

import { editor as ed } from "monaco-editor/esm/vs/editor/editor.api";

const initialText: string =
  "// type your code...\nfunction frig() { console.log('hi') }";

interface Doc {
  text: Automerge.Text;
}

export default class App extends React.Component<{}, { doc: Doc }> {
  constructor(props: any) {
    super(props);

    const emptyDoc = Automerge.init<Doc>();

    this.state = {
      doc: Automerge.change(emptyDoc, "Initialize doc", doc => {
        doc.text = new Automerge.Text();

        doc.text.insertAt(0, ...initialText);
      })
    };
  }

  editorDidMount(editor: ed.IStandaloneCodeEditor, _monaco: any) {
    console.log("editorDidMount", editor);
    editor.focus();
  }

  onChange = (_newValue: string, e: ed.IModelContentChangedEvent) => {
    this.setState(prev => ({
      doc: Automerge.change(prev.doc, "Monaco change", d => {
        e.changes.forEach(change => {
          d.text.splice(change.rangeOffset, change.rangeLength, ...change.text);
        });
      })
    }));
  };

  editorWillMount(_monaco: any) {
    console.log("Mounting!");
    // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    //   validate: true,
    //   schemas: [
    //     {
    //       uri: "http://myserver/foo-schema.json",
    //       fileMatch: ["*"],
    //       schema: {
    //         type: "object",
    //         properties: {
    //           p1: {
    //             enum: ["v1", "v2"]
    //           },
    //           p2: {
    //             $ref: "http://myserver/bar-schema.json"
    //           }
    //         }
    //       }
    //     }
    //   ]
    // });
  }
  render() {
    const { text } = this.state.doc;

    const model = text.join("");

    const options = {
      selectOnLineNumbers: true
    };

    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <MonacoEditor
          language="typescript"
          theme="vs-dark"
          value={model}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
          editorWillMount={this.editorWillMount}
        />
        <div style={{ padding: 10, backgroundColor: "#211", color: "#ddd" }}>
          i am a helpful sidebar!
        </div>
      </div>
    );
  }
}
