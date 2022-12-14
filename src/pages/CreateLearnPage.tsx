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
const learnPageExtension = '.lap';

export function CreateLearnPage() {
  const [queryParameters] = useSearchParams();
  const [learnProject, setLearnProject] = useState('');
  const [markDownContent, setMarkDownContent] = useState('');
  const [editor, setEditor] = useState<
    editor.IStandaloneCodeEditor | undefined
  >(undefined);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useAsyncEffect(
    async (isMounted) => {
      if (!editor || !titleInputRef.current) return;

      const learnProject = queryParameters.get(
        CreateLearnPageSearchParameterProject
      );
      let learnPage = queryParameters.get(CreateLearnPageSearchParameterPage);
      if (learnProject && learnPage) {
        const newValue = await window.electron.learnPage.load(
          learnProject,
          learnPage
        );
        if (!isMounted()) return;
        setLearnProject(learnProject);

        if (
          learnPage.substring(learnPage.length - learnPageExtension.length) ===
          learnPageExtension
        ) {
          learnPage = learnPage.substring(
            0,
            learnPage.length - learnPageExtension.length
          );
        }
        titleInputRef.current.value = learnPage;
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
    [editor, titleInputRef.current]
  );

  async function saveLearnPage() {
    if (!titleInputRef.current || !editor) return;

    const [learnPageName, learnProjectName] =
      await window.electron.learnPage.save(
        editor.getValue(),
        titleInputRef.current.value,
        learnProject.length > 0 ? learnProject : titleInputRef.current.value
      );
    titleInputRef.current.value = learnPageName;
    setLearnProject(learnProjectName);
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
