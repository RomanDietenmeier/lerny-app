import MonacoEditor, { EditorProps } from '@monaco-editor/react';
import { DefaultSpinner } from 'constants/Spinners';
import { Timeouts } from 'constants/timeouts';
import _ from 'lodash';
import { editor } from 'monaco-editor';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentTheme } from 'redux/selectors/themeSelectors';
import 'styles/xtermOverride.css';
import 'xterm/css/xterm.css';
import { CodeEditorWrapper } from './CodeEditor.style';
import { font } from 'constants/font';

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
  fontSize: font.px.sizeSmall,
  scrollBeyondLastLine: false,
  scrollbar: {
    alwaysConsumeMouseWheel: false,
  },
};

export type CodeEditorTerminalProps = {
  runCommand?: string;
  testCommand?: string;
  terminalHtmlId?: string;
};

export type CodeEditorProps = {
  filename?: string;
  folderStructure?: Array<string>;
  initialCodeEditorValue?: string;
  learnProject?: string;
  monacoEditorProps?: EditorProps;
  setEditor?: (editor: editor.IStandaloneCodeEditor) => void;
  onHeightChanged?: (height: string) => void;
};

export function CodeEditor({
  filename,
  folderStructure,
  initialCodeEditorValue,
  learnProject,
  monacoEditorProps,
  setEditor,
  onHeightChanged,
}: CodeEditorProps): JSX.Element {
  const currentTheme = useSelector(selectCurrentTheme);
  const [codeEditor, setCodeEditor] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const [editorHeight, setEditorHeight] = useState('0px');

  useEffect(() => {
    if (onHeightChanged) onHeightChanged(editorHeight);
  }, [editorHeight]);

  useEffect(() => {
    if (!codeEditor) return;

    codeEditor.onDidChangeModelContent(() => {
      resizeEditor();
    });
    codeEditor.onDidChangeHiddenAreas(() => {
      resizeEditor();
    });

    function resizeEditor() {
      if (!codeEditor) return;

      codeEditor.setScrollTop(0);
      const model = codeEditor.getModel();
      if (!model) return;
      const lineCount = model.getLineCount();
      setEditorHeight(`${codeEditor.getBottomForLineNumber(lineCount)}px`);
    }

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

  async function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    _monaco: MonacoEditorType
  ) {
    setCodeEditor(editor);
    const loadedSourceFile =
      !learnProject || !filename
        ? undefined
        : await window.electron.learnPage.loadFile(
            learnProject,
            filename,
            folderStructure
          );

    editor.setValue(loadedSourceFile || initialCodeEditorValue || '');

    if (!setEditor) return;
    setEditor(editor);
  }

  return (
    <CodeEditorWrapper height={editorHeight}>
      <MonacoEditor
        {...monacoEditorProps}
        onMount={handleEditorDidMount}
        theme={
          monacoEditorProps?.theme ||
          currentTheme.monacoEditorTheme ||
          'vs-dark'
        }
        wrapperProps={{
          style: defaultMonacoWrapperStyle,
          ...monacoEditorProps?.wrapperProps,
        }}
        options={{ ...monacoEditorOptions, ...monacoEditorProps?.options }}
        loading={monacoEditorProps?.loading ?? <DefaultSpinner />}
      />
    </CodeEditorWrapper>
  );
}
