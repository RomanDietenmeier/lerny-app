import { editor } from 'monaco-editor';
import React, { useRef, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
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
import { useSearchParams } from 'react-router-dom';

export const CreateLearnPageSearchParameterProject = 'project';
export const CreateLearnPageSearchParameterPage = 'page';

export function CreateLearnPage() {
  const [queryParameters] = useSearchParams();
  const [markDownContent, setMarkDownContent] = useState('');
  const [editor, setEditor] = useState<
    editor.IStandaloneCodeEditor | undefined
  >(undefined);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useAsyncEffect(
    async (isMounted) => {
      if (!editor) return;

      const learnProject = queryParameters.get(
        CreateLearnPageSearchParameterProject
      );
      const learnPage = queryParameters.get(CreateLearnPageSearchParameterPage);
      if (learnProject && learnPage) {
        const newValue = await window.electron.learnPage.load(
          learnProject,
          learnPage
        );
        if (!isMounted()) return;
        editor.setValue(newValue);
      }

      const updateMarkdownView = _.debounce(() => {
        setMarkDownContent(editor.getValue());
      }, 500);
      const disposeModelListener = editor.onDidChangeModelContent((_evt) => {
        updateMarkdownView();
      });
      updateMarkdownView();
      return () => {
        disposeModelListener.dispose();
      };
    },
    [editor]
  );

  function saveLearnPage() {
    if (!titleInputRef.current || !editor) return;
    if (titleInputRef.current.value.length < 1)
      titleInputRef.current.value = 'untitled';
    window.electron.learnPage.save(
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
