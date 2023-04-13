import React from 'react';
import { useDispatch } from 'react-redux';
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

export function StartPage() {
  const dispatch = useDispatch();
  const [onClickOnLearnPage] = useNavigateOnSelectedLearnPage(
    RouterRoutes.LearnPage
  );

  useAsyncEffect(async () => {
    const learnProjects =
      await window.electron.getLocalLearnProjectAndLearnPages();

    dispatch(setLearnProjects(learnProjects));
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
        <StartPageNavLink to="/import">
          <StartPageButton>import</StartPageButton>
        </StartPageNavLink>
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
