import React from "react";

import MonacoEditor from "react-monaco-editor";
import { change, undo, redo, canUndo, canRedo } from "automerge";

import Monaco, {
  editor as Editor
} from "monaco-editor/esm/vs/editor/editor.api";
import { Doc } from "./Doc";

export interface MonAutoProps {
  value: Doc | null;
  onChange(changeHandler: () => Doc): void;
}

export default class MonacoAutomerge extends React.Component<MonAutoProps> {
  onChange = (_newValue: string, e: Editor.IModelContentChangedEvent) => {
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
      change(this.props.value!, changeDescription, d => {
        e.changes.forEach(c => {
          d.text.splice(c.rangeOffset, c.rangeLength, ...c.text);
        });
      })
    );
  };

  undo = () => {
    const { onChange, value } = this.props;

    if (value && onChange && canUndo(value)) {
      this.props.onChange(() => undo(value));
    }
  };

  redo = () => {
    const { onChange, value } = this.props;

    if (value && onChange && canRedo(value)) {
      this.props.onChange(() => redo(value));
    }
  };

  editorDidMount = (
    editor: Editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Z, this.undo);

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_Z,
      this.redo
    );
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Y, this.redo);
  };

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
        editorDidMount={this.editorDidMount}
        // editorWillMount={this.editorWillMount}
      />
    );
  }
}
