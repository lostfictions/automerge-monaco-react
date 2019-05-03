import React from "react";

import MonacoEditor from "react-monaco-editor";
import Automerge from "automerge";

import { editor as ed } from "monaco-editor/esm/vs/editor/editor.api";
import { Doc } from "./Doc";

export interface MonAutoProps {
  value: Doc | null;
  onChange(changeHandler: () => Doc): void;
}

export default class MonacoAutomerge extends React.Component<MonAutoProps> {
  // editorDidMount(editor: ed.IStandaloneCodeEditor, _monaco: any) {
  //   // console.log("editorDidMount", editor);
  //   // editor.focus();
  // }

  onChange = (_newValue: string, e: ed.IModelContentChangedEvent) => {
    const changeDescription =
      "Text Change: " +
      (() => {
        switch (true) {
          case e.isRedoing:
            return "Redo";
          case e.isUndoing:
            return "Undo";
          case e.changes.every(c => c.text.length > 0 && c.rangeLength === 0):
            return "Insert";
          case e.changes.every(c => c.text.length === 0 && c.rangeLength > 0):
            return "Delete";
          case e.changes.every(c => c.text.length > 0 && c.rangeLength > 0):
            return "Replace";
          default:
            return "Other Edit";
        }
      })();

    this.props.onChange(() =>
      Automerge.change(this.props.value!, changeDescription, d => {
        e.changes.forEach(change => {
          d.text.splice(change.rangeOffset, change.rangeLength, ...change.text);
        });
      })
    );
  };

  // editorWillMount(_monaco: any) {
  //   console.log("Mounting!");
  //   // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  //   //   validate: true,
  //   //   schemas: [
  //   //     {
  //   //       uri: "http://myserver/foo-schema.json",
  //   //       fileMatch: ["*"],
  //   //       schema: {
  //   //         type: "object",
  //   //         properties: {
  //   //           p1: {
  //   //             enum: ["v1", "v2"]
  //   //           },
  //   //           p2: {
  //   //             $ref: "http://myserver/bar-schema.json"
  //   //           }
  //   //         }
  //   //       }
  //   //     }
  //   //   ]
  //   // });
  // }
  render() {
    if (!this.props.value) {
      return <div>Loading...</div>;
    }

    const { text } = this.props.value;

    const model = text.join("");

    const options = {
      selectOnLineNumbers: true
    };

    return (
      <MonacoEditor
        language="typescript"
        theme="vs-dark"
        value={model}
        options={options}
        onChange={this.onChange}
        // editorDidMount={this.editorDidMount}
        // editorWillMount={this.editorWillMount}
      />
    );
  }
}
