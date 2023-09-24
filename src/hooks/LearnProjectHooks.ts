import {
  LearnPageSearchParameters,
  useSearchParamsOnSelectedLearnPage,
} from 'hooks/LearnPageHooks';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';

export function useNavigateOnSelectedLearnProject(targetRoute: string) {
  const navigate = useNavigate();
  const learnProjects = useSelector(selectLearnProjects);
  function onClickOnLearnProject(project: string, page?: string) {
    if (!page) {
      page = learnProjects[project][0];
    }
    navigate(
      `${targetRoute}?${LearnPageSearchParameters.project}=${project}&${LearnPageSearchParameters.page}=${page}`
    );
  }
  return [onClickOnLearnProject];
}

export const useSearchParamsOnSelectedLearnProject =
  useSearchParamsOnSelectedLearnPage;
