import { font } from 'constants/font';
import { RouterRoutes } from 'constants/routerRoutes';
import React, { useEffect, useRef, useState } from 'react';
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
import _ from 'lodash';
import { Timeouts } from 'constants/timeouts';

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
  const projectDirectoryRef = useRef(projectDirectory);

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
    window.electron.learnProject.onProjectDirectoryChanged(
      learnProject,
      async () => {
        const updatedDirectory =
          await window.electron.learnProject.readProjectDirectory(learnProject);
        if (updatedDirectory.length > projectDirectoryRef.current.length) {
          const addedLearnPage = updatedDirectory.filter(
            (learnPage) => !projectDirectoryRef.current.includes(learnPage)
          );
          onClickOnEditLearnPage(learnProject, addedLearnPage[0]);
        }
        setProjectDirectory(updatedDirectory);
      }
    );
  }, []);

  useAsyncEffect(async () => {
    await updateLearnProjects();
  }, []);

  useEffect(() => {
    handleChangePreviewContent();
  }, [learnPage]);

  useEffect(() => {
    projectDirectoryRef.current = projectDirectory;
  }, [projectDirectory]);

  function handleOnClickLearnPage(page: string) {
    onClickOnEditLearnPage(learnProject, page);
  }

  function handleOnAddFile() {
    onClickOnEditLearnPage(learnProject, '');
  }

  async function handleDeleteAndLeavePage(learnPage: string) {
    if (projectDirectory.length === 1) {
      await window.electron.learnProject.deleteProject(learnProject);
      navigate(RouterRoutes.Root);
    } else {
      const pageIndex = projectDirectory.indexOf(learnPage);
      if (pageIndex < 0) return;

      if (pageIndex === 0)
        onClickOnEditLearnPage(learnProject, projectDirectory[1]);
      else
        onClickOnEditLearnPage(learnProject, projectDirectory[pageIndex - 1]);
      const deletePageDebounced = _.debounce(
        async () =>
          await window.electron.learnPage.deleteLearnPage(
            learnProject,
            learnPage
          ),
        Timeouts.DebunceDeleteTimeout
      );
      deletePageDebounced();
    }
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
                onContextMenu={(event) => show({ id: page, event })}
              >
                {page}
                <StyledProjectMenu
                  id={page}
                  style={{ fontSize: font.sizeNormal }}
                >
                  <Item onClick={() => handleDeleteAndLeavePage(page)}>
                    delete...
                  </Item>
                  <Separator />
                  <Item
                    onClick={() => {
                      onClickOnEditLearnProject(learnProject, page);
                    }}
                  >
                    stop editing...
                  </Item>
                  <Separator />
                  <Item
                    onClick={() =>
                      window.electron.learnPage.exportLearnPage(
                        learnProject,
                        page
                      )
                    }
                  >
                    export
                  </Item>
                </StyledProjectMenu>
              </ProjectPaneFile>
            ))}
          </ProjectPaneFileWrapper>
        </ProjectPaneExplorer>
      </div>
      <ProjectPaneDirectory>
        <ProjectPaneSectionName>WORKING DIRECTORY</ProjectPaneSectionName>
        <ProjectPaneFileWrapper>
          {workingDirectory.map((file, index) => (
            <ProjectPaneFile
              key={index}
              active={false}
              style={{ cursor: 'unset' }}
              onContextMenu={(event) => show({ id: file, event })}
            >
              {file}
              <StyledProjectMenu
                id={file}
                style={{ fontSize: font.sizeNormal }}
              >
                <Item
                  onClick={() =>
                    window.electron.learnPage.deleteFile(learnProject, file)
                  }
                >
                  delete...
                </Item>
              </StyledProjectMenu>
            </ProjectPaneFile>
          ))}
        </ProjectPaneFileWrapper>
      </ProjectPaneDirectory>
    </ProjectPaneWrapper>
  );
}
