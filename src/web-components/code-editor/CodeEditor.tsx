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
import { size } from 'constants/metrics';
import { selectActiveRoute } from 'redux/selectors/activeRouteSelector';
import { RouterRoutes } from 'constants/routerRoutes';
import { TEXT_INITIALIZER } from 'pages/EditProjectPage';

type MonacoEditorType = typeof import('monaco-editor');

export const defaultMonacoWrapperStyle = {
  display: 'flex',
  position: 'relative',
  textAlign: 'initial',
  width: '100%',
  height: '100%',
};

export const enum EditorType {
  Code,
  Text,
}

const monacoEditorCodeOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: font.px.sizeSmall,
  scrollBeyondLastLine: false,
  scrollbar: {
    alwaysConsumeMouseWheel: false,
    vertical: 'hidden',
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0,
    horizontalSliderSize: 20,
  },
  lineNumbersMinChars: 3,
  padding: {
    bottom: size.default.spaceHalf * font.px.sizeSmall,
    top: size.default.spaceHalf * font.px.sizeSmall,
  },
};
const monacoEditorTextOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: font.px.sizeSmall,
  scrollBeyondLastLine: false,
  scrollbar: {
    alwaysConsumeMouseWheel: false,
    vertical: 'hidden',
    verticalScrollbarSize: 0,
  },
  padding: {
    bottom: size.default.spaceHalf * font.px.sizeSmall,
    top: size.default.spaceHalf * font.px.sizeSmall,
  },
  lineNumbers: 'off',
  folding: false,
  wordWrap: 'on',
  wrappingIndent: 'same',
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
  editorType?: EditorType;
  onValueChanged?: (value: string) => void;
};

export function CodeEditor({
  filename,
  folderStructure,
  initialCodeEditorValue,
  learnProject,
  monacoEditorProps,
  editorType,
  onValueChanged: handleValueChanged,
}: CodeEditorProps): JSX.Element {
  const currentTheme = useSelector(selectCurrentTheme);
  const activeRoute = useSelector(selectActiveRoute);
  const [codeEditor, setCodeEditor] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const [editorHeight, setEditorHeight] = useState('0px');

  useEffect(() => {
    if (!codeEditor) return;

    const disposableContentListener = codeEditor.onDidChangeModelContent(() => {
      resizeEditor();
      saveFileDebounced();
    });
    const disposableAreaListener = codeEditor.onDidChangeHiddenAreas(() => {
      resizeEditor();
    });
    const disposableBlurListener = codeEditor.onDidBlurEditorText(() => {
      if (handleValueChanged) handleValueChanged(codeEditor.getValue());
    });

    //File wird automatisch gesaved, wenn learnproject und filename mitgegeben wurden
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

    return () => {
      disposableContentListener.dispose();
      disposableAreaListener.dispose();
      disposableBlurListener.dispose();
      saveFile();
    };
  }, [learnProject, folderStructure, filename, codeEditor]);

  useEffect(() => {
    //onMount resize
    if (!codeEditor) return;
    const resizeEditorDebounced = _.debounce(resizeEditor, 1);
    resizeEditorDebounced();
  }, [codeEditor]);

  function resizeEditor() {
    if (!codeEditor) return;

    codeEditor.setScrollTop(0);
    setEditorHeight(`${codeEditor.getContentHeight()}px`);
  }

  //Nicht im Edit-Mode: Wenn sourcefile angegeben und existent, lade diese, ansonsten lade starter code
  //Im Edit-Mode: Wenn starter code, lade diesen. Ansonsten, wenn sourcefile angegeben und existent, lade diese
  //Sonst lade leeren Editor
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

    let initializingValue = '';
    if (activeRoute.route === RouterRoutes.EditProjectPage)
      initializingValue = initialCodeEditorValue || loadedSourceFile || '';
    else initializingValue = loadedSourceFile || initialCodeEditorValue || '';

    if (initializingValue === TEXT_INITIALIZER) {
      initializingValue = '';
      editor.focus();
    }

    editor.setValue(initializingValue);

    resizeEditor();
  }

  return (
    <>
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
          options={{
            ...(editorType === EditorType.Code
              ? monacoEditorCodeOptions
              : monacoEditorTextOptions),
            ...monacoEditorProps?.options,
          }}
          loading={monacoEditorProps?.loading ?? <DefaultSpinner />}
        />
      </CodeEditorWrapper>
    </>
  );
}
