import { ProjectAddCard } from 'components/ProjectAddCard';
import { ProjectCard } from 'components/ProjectCard';
import {
  ProjectsWrapper,
  StartPageWrapper as Wrapper,
} from 'pages/StartPage.style';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';
import { setLearnProjects } from 'redux/slices/learnProjectsSlice';
import { store } from 'redux/store';
import useAsyncEffect from 'use-async-effect';

export async function updateLearnProjects() {
  const learnProjects =
    await window.electron.getLocalLearnProjectAndLearnPages();

  store.dispatch(setLearnProjects(learnProjects));
}

export function StartPage() {
  const learnProjects = useSelector(selectLearnProjects);

  useAsyncEffect(async () => {
    await updateLearnProjects();
  }, []);

  return (
    <Wrapper>
      <div>PROJECTS</div>
      <ProjectsWrapper>
        <ProjectAddCard />
        {Object.entries(learnProjects).map(([project, _], index) => {
          return (
            <ProjectCard
              key={index}
              project={project}
              onProjectDeletetd={updateLearnProjects}
            />
          );
        })}
      </ProjectsWrapper>
    </Wrapper>
  );
}
