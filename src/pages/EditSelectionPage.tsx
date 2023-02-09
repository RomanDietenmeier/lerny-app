import React from 'react';
import { useSelector } from 'react-redux';
import { ShowLearnProjects } from '../components/ShowLearnProjects';
import { RouterRoutes } from '../constants/routerRoutes';
import { useNavigateOnSelectedLearnPage } from '../hooks/LearnPageHooks';
import { selectLearnProjects } from '../redux/selectors/learnProjectsSelectors';
import { LearnProjects } from '../redux/slices/learnProjectsSlice';
import { sliceObjectInTwo } from '../utilities/helper';
import { EditSelectionPageWrapper } from './EditSelectionPage.style';

export function EditSelectionPage(): JSX.Element {
  const [onClickOnLearnPage] = useNavigateOnSelectedLearnPage(
    RouterRoutes.CreateLearnPage
  );
  const [learnProjectsFirstHalf, learnProjectsSecondHalf] =
    sliceObjectInTwo<LearnProjects>(useSelector(selectLearnProjects));

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
