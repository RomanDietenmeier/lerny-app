import React, { useEffect, useState } from 'react';
import MonacoEditor, { EditorProps } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { DefaultSpinner } from '../../constants/Spinners';
import { useSelector } from 'react-redux';
import { selectCurrentTheme } from '../../redux/selectors/themeSelectors';
import _ from 'lodash';
import { Timeouts } from '../../constants/timeouts';
import 'xterm/css/xterm.css';
import '../../styles/xtermOverride.css';

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

export type CodeEditorProps = {
  filename?: string;
  folderStructure?: Array<string>;
  initialCodeEditorValue?: string;
  learnProject?: string;
  monacoEditorProps?: EditorProps;
  setEditor?: (editor: editor.IStandaloneCodeEditor) => void;
};

export function CodeEditor({
  filename,
  folderStructure,
  initialCodeEditorValue,
  learnProject,
  monacoEditorProps,
  setEditor,
}: CodeEditorProps): JSX.Element {
  const currentTheme = useSelector(selectCurrentTheme);
  const [codeEditor, setCodeEditor] =
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
    const saveFileDebounced = _.debounce(
      saveFile,
      Timeouts.DebounceSaveTimeout
    );

    const disposeModelListener = codeEditor.onDidChangeModelContent((_evt) => {
      saveFileDebounced();
    });
    return () => {
      disposeModelListener.dispose();
      saveFile();
    };
  }, [learnProject, folderStructure, filename, codeEditor]);

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    _monaco: MonacoEditorType
  ) {
    setCodeEditor(editor);
    editor.setValue(initialCodeEditorValue || '');

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
      wrapperProps={{
        style: { ...defaultMonacoWrapperStyle },
        ...monacoEditorProps?.wrapperProps,
      }}
      options={{ ...monacoEditorOptions, ...monacoEditorProps?.options }}
      loading={monacoEditorProps?.loading ?? <DefaultSpinner />}
    />
  );
}
