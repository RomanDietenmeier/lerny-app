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
  ProjectPagePaneExplorer,
  ProjectPagePaneFile,
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

export function ProjectPage() {
  const navigate = useNavigate();

  const { learnProject } = useSearchParamsOnSelectedLearnProject();
  const pages = useSelector(selectLearnProjects)[learnProject];
  const [selectedLearnPage, setSelectedLearnPage] = useState<string>();
  const [learnPageContent, setLearnPageContent] = useState('');

  const { show } = useContextMenu({ id: learnProject });

  const [onClickOnEditLearnProject] = useNavigateOnSelectedLearnProject(
    RouterRoutes.CreateLearnPage
  );

  useEffect(() => {
    if (!pages) {
      navigate(-1);
    } else {
      setSelectedLearnPage(pages[0]);
    }
  }, [pages]);

  useAsyncEffect(
    async (isMounted) => {
      if (selectedLearnPage) {
        const loadedLearnPageContent =
          await window.electron.learnPage.loadLearnPage(
            learnProject,
            selectedLearnPage
          );
        if (!isMounted()) return;
        setLearnPageContent(loadedLearnPageContent);
      }
    },
    [selectedLearnPage]
  );

  function handleOnClickLearnPage(page: string) {
    setSelectedLearnPage(page);
  }

  return (
    <ProjectPageWrapper>
      <ProjectPagePane>
        <ProjectPagePaneBar>
          <img
            src={BackIcon}
            style={{ scale: '0.75' }}
            onClick={() => {
              navigate(-1);
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
                if (!selectedLearnPage) return;
                onClickOnEditLearnProject(learnProject, selectedLearnPage);
              }}
            >
              edit...
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
        </ProjectPagePaneBar>
        <ProjectPagePaneExplorer>
          <ProjectPagePaneSectionName>EXPLORER</ProjectPagePaneSectionName>
          <div>{learnProject}</div>
          {pages?.map((page, index) => (
            <ProjectPagePaneFile
              key={index}
              active={selectedLearnPage === page}
              onClick={() => handleOnClickLearnPage(page)}
            >
              {page}
            </ProjectPagePaneFile>
          ))}
        </ProjectPagePaneExplorer>
      </ProjectPagePane>
      <MarkdownViewer content={learnPageContent} />
    </ProjectPageWrapper>
  );
}
