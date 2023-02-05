import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAsyncEffect from 'use-async-effect';
import { ShowLearnProjects } from '../components/ShowLearnProjects';
import { RouterRoutes } from '../constants/routerRoutes';
import { selectLearnProjects } from '../redux/selectors/learnProjectsSelectors';
import { setLearnProjects } from '../redux/slices/learnProjectsSlice';
import {
  StartPageButton,
  StartPageButtonWrapper,
  StartPageNavLink,
  StartPageWrapper,
} from './StartPage.style';

export function StartPage() {
  const dispatch = useDispatch();
  const learnProjects = useSelector(selectLearnProjects);

  useAsyncEffect(async () => {
    const learnProjects =
      await window.electron.getLocalLearnProjectAndLearnPages();

    dispatch(setLearnProjects(learnProjects));
  }, []);

  return (
    <StartPageWrapper>
      <StartPageButtonWrapper>
        <StartPageNavLink to="/import">
          <StartPageButton>import</StartPageButton>
        </StartPageNavLink>
        <StartPageNavLink to={RouterRoutes.SelectLearnPageToEdit}>
          <StartPageButton>edit</StartPageButton>
        </StartPageNavLink>
        <StartPageNavLink to={RouterRoutes.CreateLearnPage}>
          <StartPageButton>create</StartPageButton>
        </StartPageNavLink>
      </StartPageButtonWrapper>
      <div style={{ width: '50%', overflow: 'auto' }}>
        <ShowLearnProjects learnProjects={learnProjects} />
      </div>
    </StartPageWrapper>
  );
}
