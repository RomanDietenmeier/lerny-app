import React, { useEffect, useState } from 'react';
import MonacoEditor, { EditorProps } from '@monaco-editor/react';
import { editor, KeyCode, KeyMod } from 'monaco-editor';
import { DefaultSpinner } from '../constants/Spinners';
import { useSelector } from 'react-redux';
import { selectCurrentTheme } from '../redux/selectors/themeSelectors';

type MonacoEditorType = typeof import('monaco-editor');

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

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    _monaco: MonacoEditorType
  ) {
    SetCodeEditor(editor);

    if (!setEditor) return;
    setEditor(editor);
  }

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

    codeEditor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
      saveFile();
    });
  }, [learnProject, folderStructure, filename, codeEditor]);

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
