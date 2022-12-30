import { editor } from 'monaco-editor';
import React, { useEffect, useState } from 'react';
import {
  CodeEditor,
  defaultMonacoWrapperStyle,
} from '../components/CodeEditor';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { CreateLearnPageWrapper } from './CreateLearnPage.style';
import * as _ from 'lodash';

export function CreateLearnPage() {
  const [markDownContent, setMarkDownContent] = useState('');
  const [editor, setEditor] = useState<
    editor.IStandaloneCodeEditor | undefined
  >(undefined);

  useEffect(() => {
    if (!editor) return;
    const updateMarkdownView = _.debounce(() => {
      setMarkDownContent(editor.getValue());
    }, 500);
    const disposeModelListener = editor.onDidChangeModelContent((_evt) => {
      updateMarkdownView();
    });

    return () => {
      disposeModelListener.dispose();
    };
  }, [editor]);

  return (
    <CreateLearnPageWrapper>
      <div>CREATE LEARN PAGE</div>
      <CodeEditor
        monacoEditorProps={{
          language: 'markdown',
          wrapperProps: {
            style: {
              ...defaultMonacoWrapperStyle,
              height: '50%',
            },
          },
        }}
        setEditor={setEditor}
      />
      <MarkdownViewer content={markDownContent} />
    </CreateLearnPageWrapper>
  );
}
