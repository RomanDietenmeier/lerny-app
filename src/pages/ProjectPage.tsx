import React, { useEffect, useState } from 'react';
import {
  useNavigateOnSelectedLearnProject,
  useSearchParamsOnSelectedLearnProject,
} from 'hooks/LearnProjectHooks';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';
import { useSelector } from 'react-redux';
import {
  ProjectPagePane,
  ProjectPagePaneBar,
  ProjectPagePaneDirectory,
  ProjectPagePaneExplorer,
  ProjectPagePaneFile,
  ProjectPagePaneFileWrapper,
  ProjectPagePaneProject,
  ProjectPagePaneSectionName,
  ProjectPageWrapper,
} from './ProjectPage.style';
import BackIcon from '../icons/chevron.svg';
import EllipsisIcon from '../icons/ellipsisPrimary.svg';
import { useNavigate } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import { MarkdownViewer } from 'components/MarkdownViewer';
import { StyledProjectMenu } from 'components/ProjectCard.style';
import { Item, Separator, useContextMenu } from 'react-contexify';
import { font } from 'constants/font';
import { RouterRoutes } from 'constants/routerRoutes';
import { useNavigateOnSelectedLearnPage } from 'hooks/LearnPageHooks';
import { updateLearnProjects } from './StartPage';

export function ProjectPage() {
  const navigate = useNavigate();

  const { learnProject, learnPage } = useSearchParamsOnSelectedLearnProject();
  const pages = useSelector(selectLearnProjects)[learnProject];
  const [learnPageContent, setLearnPageContent] = useState('');

  const [workingDirectory, setWorkingDirectory] = useState(
    window.electron.learnProject.readDirectory(learnProject)
  );

  const { show } = useContextMenu({ id: learnProject });

  const [onClickOnLearnPage] = useNavigateOnSelectedLearnPage(
    RouterRoutes.ProjectPage
  );
  const [onClickOnEditLearnProject] = useNavigateOnSelectedLearnProject(
    RouterRoutes.EditProjectPage
  );

  useEffect(() => {
    window.electron.learnProject.onDirectoryChanged(learnProject, () => {
      setWorkingDirectory(
        window.electron.learnProject.readDirectory(learnProject)
      );
    });
  }, []);

  useAsyncEffect(async () => {
    await updateLearnProjects();
  }, []);

  useAsyncEffect(
    async (isMounted) => {
      const loadedLearnPageContent =
        await window.electron.learnPage.loadLearnPage(learnProject, learnPage);
      if (!isMounted()) return;
      setLearnPageContent(loadedLearnPageContent);
    },
    [learnPage]
  );

  function handleOnClickLearnPage(page: string) {
    onClickOnLearnPage(learnProject, page);
  }

  return (
    <ProjectPageWrapper>
      <ProjectPagePane>
        <div>
          <ProjectPagePaneBar>
            <img
              src={BackIcon}
              style={{ scale: '0.75' }}
              onClick={() => {
                navigate(RouterRoutes.Root);
              }}
            />
            <img
              src={EllipsisIcon}
              onClick={(event) => show({ id: learnProject, event })}
            />
            <StyledProjectMenu
              id={learnProject}
              style={{ fontSize: font.sizeNormal }}
            >
              <Item
                onClick={() => {
                  onClickOnEditLearnProject(learnProject, learnPage);
                }}
              >
                edit...
              </Item>
              <Separator />
              <Item
                onClick={async () => {
                  await window.electron.learnProject.exportProject(
                    learnProject
                  );
                }}
              >
                export...
              </Item>
              <Separator />
              <Item>delete...</Item>
            </StyledProjectMenu>
          </ProjectPagePaneBar>
          <ProjectPagePaneExplorer>
            <ProjectPagePaneSectionName>EXPLORER</ProjectPagePaneSectionName>
            <ProjectPagePaneProject>{learnProject}</ProjectPagePaneProject>
            <ProjectPagePaneFileWrapper>
              {pages?.map((page, index) => (
                <ProjectPagePaneFile
                  key={index}
                  active={learnPage === page}
                  onClick={() => handleOnClickLearnPage(page)}
                >
                  {page}
                </ProjectPagePaneFile>
              ))}
            </ProjectPagePaneFileWrapper>
          </ProjectPagePaneExplorer>
        </div>
        <ProjectPagePaneDirectory>
          <ProjectPagePaneSectionName>
            WORKING DIRECTORY
          </ProjectPagePaneSectionName>
          <ProjectPagePaneFileWrapper>
            {workingDirectory.map((directory, index) => (
              <ProjectPagePaneFile
                key={index}
                active={false}
                style={{ cursor: 'unset' }}
              >
                {directory}
              </ProjectPagePaneFile>
            ))}
          </ProjectPagePaneFileWrapper>
        </ProjectPagePaneDirectory>
      </ProjectPagePane>
      <MarkdownViewer content={learnPageContent} />
    </ProjectPageWrapper>
  );
}
