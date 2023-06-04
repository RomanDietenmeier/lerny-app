import { font } from 'constants/font';
import { useContextMenu, Item, Separator } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import {
  ProjectCardWrapper,
  ProjectCardTopLayer,
  ProjectCardMiddleLayer,
  ProjectCardBottomLayer,
  StyledProjectMenu,
} from './ProjectCard.style';
import React from 'react';
import EllipsisIcon from '../icons/ellipsis.svg';
import { RouterRoutes } from 'constants/routerRoutes';
import { useNavigateOnSelectedLearnProject } from 'hooks/LearnProjectHooks';

type ProjectCardProps = {
  project: string;
};
export function ProjectCard({ project }: ProjectCardProps): JSX.Element {
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
        if (!onClickOnLearnProject) return;
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
        <Item>delete...</Item>
      </StyledProjectMenu>
      <ProjectCardTopLayer>
        <img
          src={EllipsisIcon}
          onClick={(event) => {
            event.stopPropagation();
            show({ id: project, event });
          }}
        />
        {project}
      </ProjectCardTopLayer>
      <ProjectCardMiddleLayer />
      <ProjectCardBottomLayer />
    </ProjectCardWrapper>
  );
}
