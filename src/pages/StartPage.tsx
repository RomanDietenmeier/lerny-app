import React from 'react';
import { store } from 'redux/store';
import useAsyncEffect from 'use-async-effect';
import { ShowLearnProjects } from '../components/ShowLearnProjects';
import { RouterRoutes } from '../constants/routerRoutes';
import { useNavigateOnSelectedLearnPage } from '../hooks/LearnPageHooks';
import { setLearnProjects } from '../redux/slices/learnProjectsSlice';
import {
  StartPageButton as Button,
  StartPageButtonWrapper as ButtonWrapper,
  StartPageNavLink as NavLink,
  StartPageWrapper as Wrapper,
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
    <Wrapper>
      <ButtonWrapper>
        <NavLink to={RouterRoutes.CreateLearnPage}>
          <Button>create</Button>
        </NavLink>
        <NavLink to={RouterRoutes.SelectLearnPageToEdit}>
          <Button>edit</Button>
        </NavLink>
        <div style={{ width: 'inherit' }}>
          <Button
            onClick={async () => {
              await window.electron.learnProject.importProject();
              await updateLearnProjects();
            }}
          >
            import
          </Button>
        </div>
        <NavLink to={RouterRoutes.ExportLearnProject}>
          <Button>export</Button>
        </NavLink>
      </ButtonWrapper>
      <div style={{ width: '50%', overflow: 'auto' }}>
        <ShowLearnProjects onClickOnLearnPage={onClickOnLearnPage} />
      </div>
    </Wrapper>
  );
}
