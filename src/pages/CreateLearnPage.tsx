import _ from 'lodash';
import { editor } from 'monaco-editor';
import React, { useRef, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { Timeouts } from '../constants/timeouts';
import { useSearchParamsOnSelectedLearnPage } from '../hooks/LearnPageHooks';
import {
  CodeEditor,
  defaultMonacoWrapperStyle,
} from '../web-components/code-editor/CodeEditor';
import {
  CreateLearnPageTitleInput,
  CreateLearnPageWrapper as Wrapper,
} from './CreateLearnPage.style';

const learnPageExtension = '.lap';

export function CreateLearnPage() {
  const { learnProject: searchParameterLearnProject, learnPage } =
    useSearchParamsOnSelectedLearnPage();
  const [learnProject, setLearnProject] = useState(searchParameterLearnProject);
  const [markDownContent, setMarkDownContent] = useState('');
  const [editor, setEditor] = useState<
    editor.IStandaloneCodeEditor | undefined
  >(undefined);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useAsyncEffect(
    async (isMounted) => {
      if (!editor || !titleInputRef.current) return;

      if (learnProject && learnPage) {
        setLearnProject(learnProject);

        if (
          learnPage.substring(learnPage.length - learnPageExtension.length) ===
          learnPageExtension
        ) {
          titleInputRef.current.value = learnPage.substring(
            0,
            learnPage.length - learnPageExtension.length
          );
        } else {
          titleInputRef.current.value = learnPage;
        }

        const loadedLearnPageContent =
          await window.electron.learnPage.loadLearnPage(
            learnProject,
            learnPage
          );
        if (!isMounted()) return;

        editor.setValue(loadedLearnPageContent);
      }

      const updateFileDebounced = _.debounce(async () => {
        setMarkDownContent(editor.getValue());
        await saveLearnPage();
      }, Timeouts.DebounceSaveTimeout);
      const disposeModelListener = editor.onDidChangeModelContent((_evt) => {
        updateFileDebounced();
      });
      updateFileDebounced();
      return () => {
        disposeModelListener.dispose();
      };
    },
    [editor, titleInputRef.current]
  );

  async function saveLearnPage() {
    if (!titleInputRef.current || !titleInputRef.current.value || !editor) {
      return;
    }

    const [learnPageName, learnProjectName] =
      await window.electron.learnPage.saveLearnPage(
        editor.getValue(),
        titleInputRef.current.value,
        learnProject.length > 0 ? learnProject : titleInputRef.current.value
      );
    titleInputRef.current.value = learnPageName;
    setLearnProject(learnProjectName);
  }

  return (
    <Wrapper>
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
    </Wrapper>
  );
}
