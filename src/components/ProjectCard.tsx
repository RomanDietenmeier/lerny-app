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

type ProjectCardProps = {
  project: string;
  onClickOnProject?: (project: string) => void;
};
export function ProjectCard({
  project,
  onClickOnProject,
}: ProjectCardProps): JSX.Element {
  const { show } = useContextMenu({ id: project });

  return (
    <ProjectCardWrapper
      onClick={() => {
        if (!onClickOnProject) return;
        onClickOnProject(project);
      }}
    >
      <StyledProjectMenu id={project} style={{ fontSize: font.sizeNormal }}>
        <Item>edit...</Item>
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
          onClick={(event) => show({ id: project, event })}
        />
        {project}
      </ProjectCardTopLayer>
      <ProjectCardMiddleLayer />
      <ProjectCardBottomLayer />
    </ProjectCardWrapper>
  );
}
