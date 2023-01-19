import React, { useEffect, useState } from 'react';
import MonacoEditor, { EditorProps } from '@monaco-editor/react';
import { editor, KeyCode, KeyMod } from 'monaco-editor';
import { DefaultSpinner } from '../constants/Spinners';
import { useSelector } from 'react-redux';
import { selectCurrentTheme } from '../redux/selectors/themeSelectors';

type MonacoEditorType = typeof import('monaco-editor');

const codeEditorCommands: {
  commands: Record<number, Array<editor.ICommandHandler>>;
  addCommand: (keybinding: number, handler: editor.ICommandHandler) => void;
  removeCommand: (keybinding: number, handler: editor.ICommandHandler) => void;
} = {
  commands: {},
  addCommand: function (keybinding: number, handler: editor.ICommandHandler) {
    if (!this.commands[keybinding]) {
      this.commands[keybinding] = [];
    }
    this.commands[keybinding].push(handler);
  },
  removeCommand: function (
    keybinding: number,
    handler: editor.ICommandHandler
  ) {
    this.commands[keybinding] = this.commands[keybinding].filter(
      (currentHandler) => currentHandler !== handler
    );
  },
};

export const defaultMonacoWrapperStyle = {
  display: 'flex',
  position: 'relative',
  textAlign: 'initial',
  width: '100%',
  height: '100%',
};

const monacoEditorOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
};

type CodeEditorProps = {
  monacoEditorProps?: EditorProps;
  setEditor?: (editor: editor.IStandaloneCodeEditor) => void;
  learnProject?: string;
  folderStructure?: Array<string>;
  filename?: string;
};

export function CodeEditor({
  monacoEditorProps,
  setEditor,
  learnProject,
  folderStructure,
  filename,
}: CodeEditorProps): JSX.Element {
  const currentTheme = useSelector(selectCurrentTheme);
  const [codeEditor, SetCodeEditor] =
    useState<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!codeEditor) return;

    function saveFile() {
      if (!learnProject || !filename || !codeEditor) return;

      window.electron.learnPage.saveFile(
        codeEditor.getValue(),
        learnProject,
        filename,
        folderStructure
      );
    }

    codeEditorCommands.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, saveFile);
    console.log('addCommand', filename, codeEditorCommands);
    updateCodeEditorCommands();
    return () => {
      codeEditorCommands.removeCommand(KeyMod.CtrlCmd | KeyCode.KeyS, saveFile);
      console.log('removeCommand', filename, codeEditorCommands);
      updateCodeEditorCommands();
    };
  }, [learnProject, folderStructure, filename, codeEditor]);

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    _monaco: MonacoEditorType
  ) {
    SetCodeEditor(editor);
    console.log('editor', filename);

    if (!setEditor) return;
    setEditor(editor);
  }

  function updateCodeEditorCommands() {
    for (const [key, handlers] of Object.entries(codeEditorCommands.commands)) {
      codeEditor?.addCommand(parseInt(key), () => {
        for (const handler of handlers) {
          handler();
        }
      });
    }
  }

  return (
    <MonacoEditor
      {...monacoEditorProps}
      onMount={handleEditorDidMount}
      theme={
        monacoEditorProps?.theme || currentTheme.monacoEditorTheme || 'vs-dark'
      }
      wrapperProps={{
        style: { ...defaultMonacoWrapperStyle, height: '20%' },
        ...monacoEditorProps?.wrapperProps,
      }}
      options={{ ...monacoEditorOptions, ...monacoEditorProps?.options }}
      loading={monacoEditorProps?.loading ?? <DefaultSpinner />}
    />
  );
}

// Hermann Repo schicken
// AddCommand geht so auch nicht, weil jetzt tut es alle speicher wenn man nur eins speichern will
// Try editor.addAction() instead

// no project exists cant fetch projects error
