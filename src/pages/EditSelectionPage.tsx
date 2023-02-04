import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShowLearnProjects } from '../components/ShowLearnProjects';
import { RouterRoutes } from '../constants/routerRoutes';
import { selectLearnProjects } from '../redux/selectors/learnProjectsSelectors';
import { LearnProjects } from '../redux/slices/learnProjectsSlice';
import { sliceObjectInTwo } from '../utilities/helper';
import {
  CreateLearnPageSearchParameterPage,
  CreateLearnPageSearchParameterProject,
} from './CreateLearnPage';
import { EditSelectionPageWrapper } from './EditSelectionPage.style';

export function EditSelectionPage(): JSX.Element {
  const navigate = useNavigate();
  const [learnProjectsFirstHalf, learnProjectsSecondHalf] =
    sliceObjectInTwo<LearnProjects>(useSelector(selectLearnProjects));

  function onClickOnLearnPage(project: string, page: string) {
    navigate(
      `${RouterRoutes.CreateLearnPage}?${CreateLearnPageSearchParameterProject}=${project}&${CreateLearnPageSearchParameterPage}=${page}`
    );
  }

  return (
    <EditSelectionPageWrapper>
      <ShowLearnProjects
        learnProjects={learnProjectsFirstHalf}
        onClickOnLearnPage={onClickOnLearnPage}
      />
      <ShowLearnProjects
        learnProjects={learnProjectsSecondHalf}
        onClickOnLearnPage={onClickOnLearnPage}
      />
    </EditSelectionPageWrapper>
  );
}
