import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { Timeouts } from '../constants/timeouts';
import { useSearchParamsOnSelectedLearnPage } from '../hooks/LearnPageHooks';
import {
  CodeEditor,
  EditorType,
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
  EditProjectPageSeperatorButtonWrapper,
  EditProjectPageSeperatorButton,
  EditProjectPageBlocksWrapper,
} from './EditProjectPage.style';
import EditProjectPagePane from 'components/EditProjectPagePane';
import {
  ChunkType,
  ContentChunk,
  transformChunksToContent,
  transformContentToChunks,
} from 'utilities/helper';
import { CodeBlock } from 'components/CodeBlock';

const LEARN_PAGE_EXTENSION = '.lap';
export const TEXT_INITIALIZER = '#New Text#';
const CODE_INITIALIZER =
  '<executable-code-editor\r\nlanguage="c"\r\nfilename=""\r\n>\r\n\r\n<xml>\r\n\r\n<starter-code>\r\n</starter-code>\r\n\r\n</xml>\r\n\r\n</executable-code-editor>';

export const enum EditMode {
  Edit,
  Preview,
}

export function EditProjectPage() {
  const { learnProject: searchParameterLearnProject, learnPage } =
    useSearchParamsOnSelectedLearnPage();
  const [learnProject, setLearnProject] = useState(searchParameterLearnProject);
  const [fileContent, setFileContent] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [selectedMode, setSelectedMode] = useState(EditMode.Edit);

  //on first render
  useEffect(() => {
    loadLearnPage();
  }, []);

  useEffect(
    () => {
      if (!titleInputRef.current) return;
      setTitle();
    },
    [titleInputRef.current] //Wenn die Titelkomponente verändert wird: 'on new render'
  );

  useAsyncEffect(
    async (isMounted) => {
      const updateFileDebounced = _.debounce(async () => {
        await saveLearnPage();
      }, Timeouts.DebounceSaveTimeout);
      if (!isMounted()) return;

      updateFileDebounced();
    },
    [fileContent] //Wenn die Editorinstanzen verändert werden
  );

  async function loadLearnPage() {
    if (learnProject && learnPage) {
      setLearnProject(learnProject);

      //Lade content der LearnPage
      const loadedLearnPageContent =
        await window.electron.learnPage.loadLearnPage(learnProject, learnPage);
      setFileContent(loadedLearnPageContent);
    }
  }

  async function saveLearnPage() {
    if (!titleInputRef.current || !titleInputRef.current.value) {
      return;
    }

    const [learnPageName, learnProjectName] =
      await window.electron.learnPage.saveLearnPage(
        fileContent,
        titleInputRef.current.value,
        learnProject.length > 0 ? learnProject : titleInputRef.current.value
      );
    titleInputRef.current.value = learnPageName;
    setLearnProject(learnProjectName);
  }

  function setTitle() {
    if (!titleInputRef.current) return;
    if (
      //Wenn learnPage vom Typ LEARN_PAGE_EXTENSION ist, setze Titel-Input auf Learnpage-Name
      learnPage.substring(learnPage.length - LEARN_PAGE_EXTENSION.length) ===
      LEARN_PAGE_EXTENSION
    ) {
      titleInputRef.current.value = learnPage.substring(
        0,
        learnPage.length - LEARN_PAGE_EXTENSION.length
      );
    } else {
      //Sonst setze Titel auf Filename
      titleInputRef.current.value = learnPage;
    }
  }

  function handleChangeFileContent() {
    setSelectedMode(EditMode.Edit);
    setFileContent(''); //remove all editors to prevent update bug

    setTitle();
    loadLearnPage();
  }

  function handleValueChanged(value: string, index: number) {
    const chunkedContent = transformContentToChunks(fileContent);
    chunkedContent[index].content = value;
    setFileContent(transformChunksToContent(chunkedContent));
  }

  function isNeighbourToText(index: number): boolean {
    const chunkedContent = transformContentToChunks(fileContent);

    const preNeighbour = chunkedContent[index];
    if (preNeighbour.type === ChunkType.Markdown) return true;

    const postNeighbour = chunkedContent[index + 1];
    if (
      postNeighbour !== undefined &&
      postNeighbour.type === ChunkType.Markdown
    )
      return true;

    return false;
  }

  function handleAddEmptyTextBlock(index: number) {
    const newChunk: ContentChunk = {
      type: ChunkType.Markdown,
      content: TEXT_INITIALIZER,
    };
    const chunkedContent = transformContentToChunks(fileContent);
    chunkedContent.splice(index + 1, 0, newChunk);
    setFileContent(transformChunksToContent(chunkedContent));
  }

  function handleAddEmptyCodeBlock(index: number) {
    const newChunk: ContentChunk = {
      type: ChunkType.Markdown,
      content: CODE_INITIALIZER,
    };
    const chunkedContent = transformContentToChunks(fileContent);
    chunkedContent.splice(index + 1, 0, newChunk);
    setFileContent(transformChunksToContent(chunkedContent));
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
            {transformContentToChunks(fileContent).map(
              (contentChunk, index) => {
                function handleOnValueChanged(value: string) {
                  handleValueChanged(value, index);
                }
                return (
                  <EditProjectPageBlocksWrapper key={index}>
                    {contentChunk.type === ChunkType.Markdown ? (
                      <CodeEditor
                        monacoEditorProps={{
                          language: 'markdown',
                          wrapperProps: {
                            style: {
                              ...defaultMonacoWrapperStyle,
                            },
                          },
                        }}
                        editorType={EditorType.Text}
                        initialCodeEditorValue={contentChunk.content}
                        onValueChanged={handleOnValueChanged}
                      />
                    ) : (
                      <CodeBlock
                        content={contentChunk.content}
                        onValueChanged={handleOnValueChanged}
                      />
                    )}
                    <EditProjectPageSeperatorButtonWrapper>
                      <EditProjectPageSeperatorButton
                        onClick={() => handleAddEmptyCodeBlock(index)}
                      >
                        +Code
                      </EditProjectPageSeperatorButton>
                      {isNeighbourToText(index) ? null : (
                        <EditProjectPageSeperatorButton
                          onClick={() => handleAddEmptyTextBlock(index)}
                        >
                          +Text
                        </EditProjectPageSeperatorButton>
                      )}
                    </EditProjectPageSeperatorButtonWrapper>
                  </EditProjectPageBlocksWrapper>
                );
              }
            )}
          </EditProjectPageEditorWrapper>
        ) : (
          <MarkdownViewer content={fileContent} />
        )}
      </ContentWrapper>
    </Wrapper>
  );
}
