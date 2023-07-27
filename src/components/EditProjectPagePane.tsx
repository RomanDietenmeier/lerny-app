import { font } from 'constants/font';
import { RouterRoutes } from 'constants/routerRoutes';
import React, { useEffect, useState } from 'react';
import { Item, Separator, useContextMenu } from 'react-contexify';
import { StyledProjectMenu } from './ProjectCard.style';
import {
  ProjectPaneWrapper,
  ProjectPaneBar,
  ProjectPaneExplorer,
  ProjectPaneSectionName,
  ProjectPaneProject,
  ProjectPaneFileWrapper,
  ProjectPaneFile,
  ProjectPaneDirectory,
} from './ProjectPane.style';
import { useNavigate } from 'react-router-dom';
import {
  useNavigateOnSelectedLearnProject,
  useSearchParamsOnSelectedLearnProject,
} from 'hooks/LearnProjectHooks';
import { useSelector } from 'react-redux';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';
import { useNavigateOnSelectedLearnPage } from 'hooks/LearnPageHooks';
import useAsyncEffect from 'use-async-effect';
import { updateLearnProjects } from 'pages/StartPage';
import BackIcon from '../icons/chevron.svg';
import EllipsisIcon from '../icons/ellipsisPrimary.svg';

type ProjectPaneProps = {
  onChangePreviewContent: (content: string) => void;
};
export default function ProjectPane({
  onChangePreviewContent: handleChangePreviewContent,
}: ProjectPaneProps) {
  const navigate = useNavigate();

  const { learnProject, learnPage } = useSearchParamsOnSelectedLearnProject();
  const pages = useSelector(selectLearnProjects)[learnProject];

  const [workingDirectory, setWorkingDirectory] = useState(
    window.electron.learnProject.readDirectory(learnProject)
  );

  const { show } = useContextMenu({ id: learnProject });

  const [onClickOnLearnPage] = useNavigateOnSelectedLearnPage(
    RouterRoutes.EditProjectPage
  );
  const [onClickOnEditLearnProject] = useNavigateOnSelectedLearnProject(
    RouterRoutes.ProjectPage
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
      handleChangePreviewContent(loadedLearnPageContent);
    },
    [learnPage]
  );

  function handleOnClickLearnPage(page: string) {
    onClickOnLearnPage(learnProject, page);
  }

  return (
    <ProjectPaneWrapper>
      <div>
        <ProjectPaneBar>
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
              stop editing...
            </Item>
            <Separator />
            <Item
              onClick={async () => {
                await window.electron.learnProject.exportProject(learnProject);
              }}
            >
              export...
            </Item>
            <Separator />
            <Item>delete...</Item>
          </StyledProjectMenu>
        </ProjectPaneBar>
        <ProjectPaneExplorer>
          <ProjectPaneSectionName>EXPLORER</ProjectPaneSectionName>
          <ProjectPaneProject>{learnProject}</ProjectPaneProject>
          <ProjectPaneFileWrapper>
            {pages?.map((page, index) => (
              <ProjectPaneFile
                key={index}
                active={learnPage === page}
                onClick={() => handleOnClickLearnPage(page)}
              >
                {page}
              </ProjectPaneFile>
            ))}
          </ProjectPaneFileWrapper>
        </ProjectPaneExplorer>
      </div>
      <ProjectPaneDirectory>
        <ProjectPaneSectionName>WORKING DIRECTORY</ProjectPaneSectionName>
        <ProjectPaneFileWrapper>
          {workingDirectory.map((directory, index) => (
            <ProjectPaneFile
              key={index}
              active={false}
              style={{ cursor: 'unset' }}
            >
              {directory}
            </ProjectPaneFile>
          ))}
        </ProjectPaneFileWrapper>
      </ProjectPaneDirectory>
    </ProjectPaneWrapper>
  );
}
