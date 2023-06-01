import React from 'react';
import { store } from 'redux/store';
import useAsyncEffect from 'use-async-effect';
import { setLearnProjects } from '../redux/slices/learnProjectsSlice';
import {
  ProjectsWrapper,
  StartPageWrapper as Wrapper,
} from './StartPage.style';
import { useSelector } from 'react-redux';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';
import { ProjectCard } from 'components/ProjectCard';
import { ProjectAddCard } from 'components/ProjectAddCard';

export async function updateLearnProjects() {
  const learnProjects =
    await window.electron.getLocalLearnProjectAndLearnPages();

  store.dispatch(setLearnProjects(learnProjects));
}

export function StartPage() {
  /* const [handleClickOnProject] = useNavigateOnSelectedLearnPage(
    RouterRoutes.LearnPage
  ); */
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
              project={project} /* onClickOnProject={handleClickOnProject} */
            />
          );
        })}
      </ProjectsWrapper>
    </Wrapper>
  );
}
