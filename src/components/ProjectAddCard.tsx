import React, { useState } from 'react';
import {
  ProjectAddCardWrapper,
  ProjectAddCardTopLayer,
  ProjectAddCardBottomLayer,
  ProjectAddCardMiddleLayer,
  ProjectAddCardOption,
  ProjectAddCardLastOption,
} from './ProjectAddCard.style';
import PlusIcon from '../icons/plusBig.svg';
import { useNavigate } from 'react-router-dom';
import { RouterRoutes } from 'constants/routerRoutes';
import { updateLearnProjects } from 'pages/StartPage';

/* type ProjectAddCardProps = {

}; */
export function ProjectAddCard(): JSX.Element {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  function toggleActive() {
    setActive(!active);
  }
  function handleOnCreateProject(event: React.FormEvent<HTMLDivElement>) {
    event.stopPropagation();
    navigate(RouterRoutes.EditProjectPage);
  }
  async function handleOnImportProject(event: React.FormEvent<HTMLDivElement>) {
    event.stopPropagation();

    await window.electron.learnProject.importProject();
    await updateLearnProjects();
  }

  return (
    <ProjectAddCardWrapper onClick={toggleActive}>
      <ProjectAddCardTopLayer>
        {!active ? (
          <img src={PlusIcon} />
        ) : (
          <>
            <ProjectAddCardOption onClick={handleOnCreateProject}>
              create
            </ProjectAddCardOption>
            <ProjectAddCardLastOption onClick={handleOnImportProject}>
              import
            </ProjectAddCardLastOption>
          </>
        )}
      </ProjectAddCardTopLayer>
      <ProjectAddCardMiddleLayer />
      <ProjectAddCardBottomLayer />
    </ProjectAddCardWrapper>
  );
}
