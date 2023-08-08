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
import { useNavigateOnSelectedLearnPage } from 'hooks/LearnPageHooks';
import useAsyncEffect from 'use-async-effect';
import { updateLearnProjects } from 'pages/StartPage';
import BackIcon from '../icons/chevron.svg';
import EllipsisIcon from '../icons/ellipsisPrimary.svg';
import AddFileIcon from '../icons/add-file.svg';

type ProjectPaneProps = {
  onChangePreviewContent: () => void;
};
export default function ProjectPane({
  onChangePreviewContent: handleChangePreviewContent,
}: ProjectPaneProps) {
  const navigate = useNavigate();

  const { learnProject, learnPage } = useSearchParamsOnSelectedLearnProject();

  const [projectDirectory, setProjectDirectory] = useState(
    window.electron.learnProject.readProjectDirectory(learnProject)
  );

  const [workingDirectory, setWorkingDirectory] = useState(
    window.electron.learnProject.readWorkingDirectory(learnProject)
  );

  const { show } = useContextMenu({ id: learnProject });

  const [onClickOnEditLearnPage] = useNavigateOnSelectedLearnPage(
    RouterRoutes.EditProjectPage
  );
  const [onClickOnEditLearnProject] = useNavigateOnSelectedLearnProject(
    RouterRoutes.ProjectPage
  );

  useEffect(() => {
    window.electron.learnProject.onWorkingDirectoryChanged(learnProject, () => {
      setWorkingDirectory(
        window.electron.learnProject.readWorkingDirectory(learnProject)
      );
    });
    window.electron.learnProject.onProjectDirectoryChanged(learnProject, () => {
      setProjectDirectory(
        window.electron.learnProject.readProjectDirectory(learnProject)
      );
    });
  }, []);

  useAsyncEffect(async () => {
    await updateLearnProjects();
  }, []);

  useEffect(() => {
    handleChangePreviewContent();
  }, [learnPage]);

  function handleOnClickLearnPage(page: string) {
    onClickOnEditLearnPage(learnProject, page);
  }

  function handleOnAddFile() {
    onClickOnEditLearnPage(learnProject, '');
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
          <ProjectPaneProject>
            {learnProject}
            <img src={AddFileIcon} onClick={handleOnAddFile} />
          </ProjectPaneProject>
          <ProjectPaneFileWrapper>
            {projectDirectory?.map((page, index) => (
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
