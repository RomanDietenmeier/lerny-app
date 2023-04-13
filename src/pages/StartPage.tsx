import React from 'react';
import { store } from 'redux/store';
import useAsyncEffect from 'use-async-effect';
import { ShowLearnProjects } from '../components/ShowLearnProjects';
import { RouterRoutes } from '../constants/routerRoutes';
import { useNavigateOnSelectedLearnPage } from '../hooks/LearnPageHooks';
import { setLearnProjects } from '../redux/slices/learnProjectsSlice';
import {
  StartPageButton,
  StartPageButtonWrapper,
  StartPageNavLink,
  StartPageWrapper,
} from './StartPage.style';

async function updateLearnProjects() {
  const learnProjects =
    await window.electron.getLocalLearnProjectAndLearnPages();

  store.dispatch(setLearnProjects(learnProjects));
}

export function StartPage() {
  const [onClickOnLearnPage] = useNavigateOnSelectedLearnPage(
    RouterRoutes.LearnPage
  );

  useAsyncEffect(async () => {
    await updateLearnProjects();
  }, []);

  return (
    <StartPageWrapper>
      <StartPageButtonWrapper>
        <StartPageNavLink to={RouterRoutes.CreateLearnPage}>
          <StartPageButton>create</StartPageButton>
        </StartPageNavLink>
        <StartPageNavLink to={RouterRoutes.SelectLearnPageToEdit}>
          <StartPageButton>edit</StartPageButton>
        </StartPageNavLink>
        <div style={{ width: 'inherit' }}>
          <StartPageButton
            onClick={async () => {
              await window.electron.learnProject.importProject();
              await updateLearnProjects();
            }}
          >
            import
          </StartPageButton>
        </div>
        <StartPageNavLink to={RouterRoutes.ExportLearnProject}>
          <StartPageButton>export</StartPageButton>
        </StartPageNavLink>
      </StartPageButtonWrapper>
      <div style={{ width: '50%', overflow: 'auto' }}>
        <ShowLearnProjects onClickOnLearnPage={onClickOnLearnPage} />
      </div>
    </StartPageWrapper>
  );
}
