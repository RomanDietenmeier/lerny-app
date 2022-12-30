import React from 'react';
import MonacoEditor, { EditorProps } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { DefaultSpinner } from '../constants/Spinners';
import { useSelector } from 'react-redux';
import { selectCurrentTheme } from '../redux/selectors/themeSelectors';

type MonacoEditorType = typeof import('monaco-editor');

const options: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
};

type CodeEditorProps = {
  monacoEditorProps?: EditorProps;
  setEditor?: (editor: editor.IStandaloneCodeEditor) => void;
};

export function CodeEditor({
  monacoEditorProps,
  setEditor,
}: CodeEditorProps): JSX.Element {
  const currentTheme = useSelector(selectCurrentTheme);

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    _monaco: MonacoEditorType
  ) {
    if (!setEditor) return;
    setEditor(editor);
  }

  return (
    <MonacoEditor
      {...monacoEditorProps}
      onMount={handleEditorDidMount}
      theme={
        monacoEditorProps?.theme || currentTheme.monacoEditorTheme || 'vs-dark'
      }
      options={monacoEditorProps?.options ?? options}
      loading={monacoEditorProps?.loading ?? <DefaultSpinner />}
    />
  );
}
