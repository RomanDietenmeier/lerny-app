import { editor } from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';
import {
  CodeEditor,
  defaultMonacoWrapperStyle,
} from '../components/CodeEditor';
import { MarkdownViewer } from '../components/MarkdownViewer';
import {
  CreateLearnPageSaveButton,
  CreateLearnPageTitleInput,
  CreateLearnPageWrapper,
} from './CreateLearnPage.style';
import * as _ from 'lodash';

export function CreateLearnPage() {
  const [markDownContent, setMarkDownContent] = useState('');
  const [editor, setEditor] = useState<
    editor.IStandaloneCodeEditor | undefined
  >(undefined);
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  function saveLearnPage() {
    if (!titleInputRef.current || !editor) return;
    if (titleInputRef.current.value.length < 1)
      titleInputRef.current.value = 'untitled';
    window.electron.saveLearnPage(
      editor.getValue(),
      titleInputRef.current.value,
      titleInputRef.current.value
    );
  }

  return (
    <CreateLearnPageWrapper>
      <CreateLearnPageSaveButton onClick={saveLearnPage}>
        SAVE
      </CreateLearnPageSaveButton>
      <div>CREATE LEARN PAGE</div>
      <CreateLearnPageTitleInput
        type="text"
        placeholder="Title"
        ref={titleInputRef}
      />
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
