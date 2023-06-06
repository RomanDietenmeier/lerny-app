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
import { EllipsisWrapper } from './IconWrapper.style';

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
