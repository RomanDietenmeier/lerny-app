import {
  ProjectAddCardBottomLayer,
  ProjectAddCardInput,
  ProjectAddCardLastOption,
  ProjectAddCardMiddleLayer,
  ProjectAddCardOption,
  ProjectAddCardTopLayer,
  ProjectAddCardWrapper,
} from 'components/ProjectAddCard.style';
import { RouterRoutes } from 'constants/routerRoutes';
import { useNavigateOnSelectedLearnProject } from 'hooks/LearnProjectHooks';
import { updateLearnProjects } from 'pages/StartPage';
import React, { useEffect, useRef, useState } from 'react';
import PlusIcon from '../icons/plusBig.svg';

export function ProjectAddCard(): JSX.Element {
  const [active, setActive] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const projectInputRef = useRef<HTMLInputElement>(null);

  const [onClickOnEditLearnProject] = useNavigateOnSelectedLearnProject(
    RouterRoutes.EditProjectPage
  );

  useEffect(() => {
    if (!projectInputRef.current) return;
    projectInputRef.current.focus();
  }, [showInput]);

  function toggleActive() {
    setActive(!active);
  }
  async function handleCreateProject() {
    if (!projectInputRef.current || projectInputRef.current.value === '')
      return;
    const projectTitle = await window.electron.learnProject.createProject(
      projectInputRef.current.value
    );
    const [learnPageName, learnProjectName] =
      await window.electron.learnPage.saveLearnPage(
        '',
        'firstPage',
        projectTitle
      );
    onClickOnEditLearnProject(learnProjectName, learnPageName);
  }
  async function handleOnImportProject(event: React.FormEvent<HTMLDivElement>) {
    event.stopPropagation();

    await window.electron.learnProject.importProject();
    await updateLearnProjects();
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      handleCreateProject();
    }
  }

  return (
    <ProjectAddCardWrapper onClick={toggleActive}>
      <ProjectAddCardTopLayer>
        {!active ? (
          <img src={PlusIcon} />
        ) : (
          <>
            {showInput ? (
              <ProjectAddCardInput
                ref={projectInputRef}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onBlur={() => setShowInput(false)}
                onKeyUp={handleKeyUp}
                placeholder="Project Title"
              />
            ) : (
              <ProjectAddCardOption
                onClick={(event) => {
                  event.stopPropagation();
                  setShowInput(true);
                  projectInputRef.current?.focus();
                }}
              >
                create
              </ProjectAddCardOption>
            )}

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
