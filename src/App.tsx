import React from "react";

import MonacoEditor from "react-monaco-editor";

import { editor as ed } from "monaco-editor/esm/vs/editor/editor.api";

export default class App extends React.Component<{}, { code: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      code: "// type your code..."
    };
  }
  editorDidMount(editor: ed.IStandaloneCodeEditor, _monaco: any) {
    console.log("editorDidMount", editor);
    editor.focus();
  }

  onChange = (newValue: string, _e: ed.IModelContentChangedEvent) => {
    this.setState({ code: newValue });
    // console.log("onChange", newVdalue, e);
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
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };

    return (
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
        editorWillMount={this.editorWillMount}
      />
    );
  }
}
