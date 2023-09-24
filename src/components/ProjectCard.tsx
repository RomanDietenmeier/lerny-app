import { EllipsisWrapper } from 'components/IconWrapper.style';
import {
  ProjectCardBottomLayer,
  ProjectCardMiddleLayer,
  ProjectCardTopLayer,
  ProjectCardWrapper,
  StyledProjectMenu,
} from 'components/ProjectCard.style';
import { font } from 'constants/font';
import { RouterRoutes } from 'constants/routerRoutes';
import { useNavigateOnSelectedLearnProject } from 'hooks/LearnProjectHooks';
import React from 'react';
import { Item, Separator, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import EllipsisIcon from '../icons/ellipsis.svg';

type ProjectCardProps = {
  project: string;
  onProjectDeletetd: () => void;
};
export function ProjectCard({
  project,
  onProjectDeletetd: handleProjectDeleted,
}: ProjectCardProps): JSX.Element {
  const { show } = useContextMenu({ id: project });
  const [onClickOnLearnProject] = useNavigateOnSelectedLearnProject(
    RouterRoutes.ProjectPage
  );
  const [onClickOnEditLearnProject] = useNavigateOnSelectedLearnProject(
    RouterRoutes.EditProjectPage
  );

  return (
    <ProjectCardWrapper
      onClick={() => {
        onClickOnLearnProject(project);
      }}
    >
      <StyledProjectMenu id={project} style={{ fontSize: font.sizeNormal }}>
        <Item onClick={() => onClickOnEditLearnProject(project)}>edit...</Item>
        <Separator />
        <Item
          onClick={async () => {
            await window.electron.learnProject.exportProject(project);
          }}
        >
          export...
        </Item>
        <Separator />
        <Item
          onClick={async () => {
            await window.electron.learnProject.deleteProject(project);
            handleProjectDeleted();
          }}
        >
          delete...
        </Item>
      </StyledProjectMenu>
      <ProjectCardTopLayer>
        <EllipsisWrapper
          onClick={(event) => {
            event.stopPropagation();
            show({ id: project, event });
          }}
          hoverColor="rgba(0,0,0,0.33)"
        >
          <img src={EllipsisIcon} />
        </EllipsisWrapper>
        {project}
      </ProjectCardTopLayer>
      <ProjectCardMiddleLayer />
      <ProjectCardBottomLayer />
    </ProjectCardWrapper>
  );
}
