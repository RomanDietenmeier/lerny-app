import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { Timeouts } from '../constants/timeouts';
import {
  useNavigateOnSelectedLearnPage,
  useSearchParamsOnSelectedLearnPage,
} from '../hooks/LearnPageHooks';
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
  EditProjectPageBlocksButtonWrapper,
  EditProjectPageBlockButton,
} from './EditProjectPage.style';
import EditProjectPagePane from 'components/EditProjectPagePane';
import {
  ChunkType,
  ContentChunk,
  transformChunksToContent,
  transformContentToChunks,
} from 'utilities/helper';
import { CodeBlock } from 'components/CodeBlock';
import ChevronIcon from '../icons/chevron.svg';
import DeleteIcon from '../icons/trash.svg';
import CrossIcon from '../icons/cross.svg';
import CheckIcon from '../icons/check.svg';
import { RouterRoutes } from 'constants/routerRoutes';

const LEARN_PAGE_EXTENSION = '.lap';
export const TEXT_INITIALIZER = '#New Text#';
const CODE_INITIALIZER =
  '<executable-code-editor\r\nlanguage=""\r\nfilename=""\r\n>\r\n\r\n<xml>\r\n\r\n<starter-code>\r\n</starter-code>\r\n\r\n</xml>\r\n\r\n</executable-code-editor>';

export const enum EditMode {
  Edit,
  Preview,
}
type EditProjectPageBlockButtonsProps = {
  index: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (index: number) => void;
};
function EditProjectPageBlockButtons({
  index,
  onMoveUp: handleMoveUp,
  onMoveDown: handleMoveDown,
  onDelete: handleDelete,
}: EditProjectPageBlockButtonsProps) {
  return (
    <EditProjectPageBlocksButtonWrapper>
      <EditProjectPageBlockButton onClick={() => handleMoveUp(index)}>
        <img src={ChevronIcon} style={{ transform: 'rotate(90deg)' }} />
      </EditProjectPageBlockButton>
      <EditProjectPageBlockButton onClick={() => handleMoveDown(index)}>
        <img src={ChevronIcon} style={{ transform: 'rotate(-90deg)' }} />
      </EditProjectPageBlockButton>
      <EditProjectPageBlockButton onClick={() => handleDelete(index)}>
        <img src={DeleteIcon} />
      </EditProjectPageBlockButton>
    </EditProjectPageBlocksButtonWrapper>
  );
}

export function EditProjectPage() {
  const [onClickOnEditLearnPage] = useNavigateOnSelectedLearnPage(
    RouterRoutes.EditProjectPage
  );
  const { learnProject: searchParameterLearnProject, learnPage } =
    useSearchParamsOnSelectedLearnPage();
  const [learnProject, setLearnProject] = useState(searchParameterLearnProject);
  const [fileContent, setFileContent] = useState('');
  const [showInputIcons, setShowInputIcons] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<string | null>(null);
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
    titleRef.current = titleInputRef.current.value;
  }

  async function handleChangeTitle() {
    setShowInputIcons(false);
    if (!titleInputRef.current || !titleRef.current) return;

    const extsitingPages =
      window.electron.learnProject.readProjectDirectory(learnProject);

    let count = 0;
    const regexp = new RegExp(
      `${titleInputRef.current.value}(\\(\\d+\\)|).lap`
    );

    for (const page of extsitingPages) {
      if (regexp.test(page)) count++;
    }
    let newTitle = titleInputRef.current.value;
    if (count > 0) {
      newTitle = `${titleInputRef.current.value}(${count})`;
    }

    window.electron.learnPage.renameLearnPage(
      learnProject,
      titleRef.current,
      newTitle
    );

    titleRef.current = titleInputRef.current.value;

    onClickOnEditLearnPage(learnProject, `${newTitle}${LEARN_PAGE_EXTENSION}`);
  }

  function handleCancelTitleChange() {
    setShowInputIcons(false);
    if (!titleInputRef.current || !titleRef.current) return;

    titleInputRef.current.value = titleRef.current;
  }

  async function handleChangeLearnPage() {
    await saveLearnPage();

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

    if (index === -1) {
      const postNeighbour = chunkedContent[0];
      if (
        postNeighbour !== undefined &&
        postNeighbour.type === ChunkType.Markdown
      )
        return true;
    } else {
      const preNeighbour = chunkedContent[index];
      if (preNeighbour.type === ChunkType.Markdown) return true;

      const postNeighbour = chunkedContent[index + 1];
      if (
        postNeighbour !== undefined &&
        postNeighbour.type === ChunkType.Markdown
      )
        return true;
    }

    return false;
  }

  function handleAddEmptyTextBlock(index: number) {
    const newChunk: ContentChunk = {
      type: ChunkType.Markdown,
      content: TEXT_INITIALIZER,
    };
    const chunkedContent = transformContentToChunks(fileContent);

    if (index === -1) chunkedContent.unshift(newChunk);
    else chunkedContent.splice(index + 1, 0, newChunk);
    setFileContent(transformChunksToContent(chunkedContent));
  }

  function handleAddEmptyCodeBlock(index: number) {
    const newChunk: ContentChunk = {
      type: ChunkType.Markdown,
      content: CODE_INITIALIZER,
    };
    const chunkedContent = transformContentToChunks(fileContent);

    if (index === -1) chunkedContent.unshift(newChunk);
    else chunkedContent.splice(index + 1, 0, newChunk);
    updateFileForceRerender(chunkedContent);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const chunkedContent = transformContentToChunks(fileContent);

    const neighbour = chunkedContent[index - 1];
    chunkedContent[index - 1] = chunkedContent[index];
    chunkedContent[index] = neighbour;
    updateFileForceRerender(chunkedContent);
  }
  function handleMoveDown(index: number) {
    const chunkedContent = transformContentToChunks(fileContent);
    if (chunkedContent[index + 1] === undefined) return;

    const neighbour = chunkedContent[index + 1];
    chunkedContent[index + 1] = chunkedContent[index];
    chunkedContent[index] = neighbour;
    updateFileForceRerender(chunkedContent);
  }
  function handleDelete(index: number) {
    const chunkedContent = transformContentToChunks(fileContent);
    chunkedContent.splice(index, 1);
    updateFileForceRerender(chunkedContent);
  }

  function updateFileForceRerender(chunkedContent: Array<ContentChunk>) {
    setFileContent('');

    //debounce update to force complete rerender
    const updateFileDebounced = _.debounce(() => {
      setFileContent(transformChunksToContent(chunkedContent));
    }, 1);
    updateFileDebounced();
  }

  return (
    <Wrapper>
      <EditProjectPagePane onChangePreviewContent={handleChangeLearnPage} />
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
            onClick={async () => {
              await saveLearnPage();
              setSelectedMode(EditMode.Preview);
            }}
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
                onFocus={() => setShowInputIcons(true)}
                onBlur={_.debounce(
                  () => setShowInputIcons(false),
                  Timeouts.DebounceHideIconsTimeout
                )}
              />
              {showInputIcons ? (
                <>
                  <img src={CrossIcon} onClick={handleCancelTitleChange} />
                  <img src={CheckIcon} onClick={handleChangeTitle} />
                </>
              ) : null}
            </EditProjectPageTitleWrapper>
            <EditProjectPageSeperatorButtonWrapper>
              <EditProjectPageSeperatorButton
                onClick={() => handleAddEmptyCodeBlock(-1)}
              >
                +Code
              </EditProjectPageSeperatorButton>
              {isNeighbourToText(-1) ? null : (
                <EditProjectPageSeperatorButton
                  onClick={() => handleAddEmptyTextBlock(-1)}
                >
                  +Text
                </EditProjectPageSeperatorButton>
              )}
            </EditProjectPageSeperatorButtonWrapper>
            {transformContentToChunks(fileContent).map(
              (contentChunk, index) => {
                function handleOnValueChanged(value: string) {
                  handleValueChanged(value, index);
                }
                return (
                  <EditProjectPageBlocksWrapper key={index}>
                    {contentChunk.type === ChunkType.Markdown ? (
                      <div>
                        <EditProjectPageBlockButtons
                          index={index}
                          onMoveUp={() => handleMoveUp(index)}
                          onMoveDown={() => handleMoveDown(index)}
                          onDelete={() => handleDelete(index)}
                        />
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
                      </div>
                    ) : (
                      <div>
                        <EditProjectPageBlockButtons
                          index={index}
                          onMoveUp={() => handleMoveUp(index)}
                          onMoveDown={() => handleMoveDown(index)}
                          onDelete={() => handleDelete(index)}
                        />
                        <CodeBlock
                          content={contentChunk.content}
                          onValueChanged={handleOnValueChanged}
                        />
                      </div>
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
