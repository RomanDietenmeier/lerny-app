import _ from 'lodash';
import { editor } from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { Timeouts } from '../constants/timeouts';
import { useSearchParamsOnSelectedLearnPage } from '../hooks/LearnPageHooks';
import {
  CodeEditor,
  defaultMonacoWrapperStyle,
} from '../web-components/code-editor/CodeEditor';
import {
  EditProjectPageTitleInput,
  EditProjectPageWrapper as Wrapper,
  EditProjectPageContentWrapper as ContentWrapper,
  EditProjectPageButton,
  EditProjectPageButtonWrapper,
  EditProjectPageTitleWrapper,
  EditProjectPageEditorWrapper,
} from './EditProjectPage.style';
import EditProjectPagePane from 'components/EditProjectPagePane';
import {
  ContentChunk,
  getContentFromEditors,
  transformContentToChunks,
} from 'utilities/helper';

const LEARN_PAGE_EXTENSION = '.lap';

export const enum EditMode {
  Edit,
  Preview,
}

export function EditProjectPage() {
  const { learnProject: searchParameterLearnProject, learnPage } =
    useSearchParamsOnSelectedLearnPage();
  const [learnProject, setLearnProject] = useState(searchParameterLearnProject);
  const [fileContent, setFileContent] = useState('');
  const [chunkedContent, setChunkedContent] = useState<Array<ContentChunk>>([]);
  const [editors, setEditors] = useState<
    Array<editor.IStandaloneCodeEditor | undefined>
  >([]);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [selectedMode, setSelectedMode] = useState(EditMode.Edit);

  useAsyncEffect(
    async (isMounted) => {
      if (!titleInputRef.current) return;

      if (learnProject && learnPage) {
        setLearnProject(learnProject);

        if (
          //Wenn learnPage vom Typ LEARN_PAGE_EXTENSION ist, setze Titel-Input auf Learnpage-Name
          learnPage.substring(
            learnPage.length - LEARN_PAGE_EXTENSION.length
          ) === LEARN_PAGE_EXTENSION
        ) {
          titleInputRef.current.value = learnPage.substring(
            0,
            learnPage.length - LEARN_PAGE_EXTENSION.length
          );
        } else {
          //Sonst setze Titel auf Filename
          titleInputRef.current.value = learnPage;
        }

        //Lade content der LearnPage
        const loadedLearnPageContent =
          await window.electron.learnPage.loadLearnPage(
            learnProject,
            learnPage
          );
        if (!isMounted()) return;

        //initialize empty editors
        const chunks = transformContentToChunks(loadedLearnPageContent);
        setEditors(chunks.map(() => undefined));
      }
    },
    [titleInputRef.current] //Wenn der Titel verändert wird
  );

  useAsyncEffect(
    async (isMounted) => {
      if (editors.includes(undefined)) return;

      const updateFileDebounced = _.debounce(async () => {
        setFileContent(getContentFromEditors(editors));
        await saveLearnPage();
      }, Timeouts.DebounceSaveTimeout);
      if (!isMounted()) return;

      const disposeModelListeners = editors.map((editor) =>
        editor?.onDidChangeModelContent((_evt) => {
          updateFileDebounced();
        })
      );
      updateFileDebounced();
      return () => {
        disposeModelListeners.map((disposeModelListener) =>
          disposeModelListener?.dispose()
        );
      };
    },
    [editors] //Wenn die Editorinstanzen verändert werden
  );

  useEffect(() => {
    setChunkedContent(transformContentToChunks(fileContent));
  }, [fileContent]);

  useEffect(() => {
    editors.map((editor, index) => {
      if (!editor) return;
      editor.setValue(chunkedContent[index].content);
    });
  }, [editors]);

  async function saveLearnPage() {
    if (
      !titleInputRef.current ||
      !titleInputRef.current.value ||
      editors.includes(undefined)
    ) {
      return;
    }

    const [learnPageName, learnProjectName] =
      await window.electron.learnPage.saveLearnPage(
        getContentFromEditors(editors),
        titleInputRef.current.value,
        learnProject.length > 0 ? learnProject : titleInputRef.current.value
      );
    titleInputRef.current.value = learnPageName;
    setLearnProject(learnProjectName);
  }

  function handleChangeFileContent(content: string) {
    setFileContent(content);
  }

  return (
    <Wrapper>
      <EditProjectPagePane onChangePreviewContent={handleChangeFileContent} />
      <ContentWrapper>
        <EditProjectPageButtonWrapper>
          <EditProjectPageButton
            //disabled when active
            disabled={selectedMode === EditMode.Edit}
            onClick={() => setSelectedMode(EditMode.Edit)}
          >
            EDIT
          </EditProjectPageButton>
          <EditProjectPageButton
            //disabled when active
            disabled={selectedMode === EditMode.Preview}
            onClick={() => setSelectedMode(EditMode.Preview)}
          >
            PREVIEW
          </EditProjectPageButton>
        </EditProjectPageButtonWrapper>

        {selectedMode === EditMode.Edit ? (
          <EditProjectPageEditorWrapper>
            <EditProjectPageTitleWrapper>
              <div>Title:</div>
              <EditProjectPageTitleInput
                type="text"
                placeholder="Title"
                ref={titleInputRef}
              />
            </EditProjectPageTitleWrapper>
            {editors.map((_, index) => {
              function initializeEditor(editor: editor.IStandaloneCodeEditor) {
                const tempEditors = editors;
                tempEditors[index] = editor;
                setEditors([...tempEditors]);
              }
              return (
                <CodeEditor
                  key={index}
                  monacoEditorProps={{
                    language: 'markdown',
                    wrapperProps: {
                      style: {
                        ...defaultMonacoWrapperStyle,
                      },
                    },
                  }}
                  onMount={initializeEditor}
                />
              );
            })}
          </EditProjectPageEditorWrapper>
        ) : (
          <MarkdownViewer content={fileContent} />
        )}
      </ContentWrapper>
    </Wrapper>
  );
}
