import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';

export const enum LearnPageSearchParameters {
  project = 'project',
  page = 'page',
}

export function useNavigateOnSelectedLearnPage(targetRoute: string) {
  const navigate = useNavigate();
  const learnProjects = useSelector(selectLearnProjects);
  function onClickOnLearnPage(project: string, page?: string) {
    if (!page) {
      page = learnProjects[project][0];
    }

    navigate(
      `${targetRoute}?${LearnPageSearchParameters.project}=${project}&${LearnPageSearchParameters.page}=${page}`
    );
  }
  return [onClickOnLearnPage];
}

export function useSearchParamsOnSelectedLearnPage() {
  const [queryParameters] = useSearchParams();

  return {
    learnProject: queryParameters.get(LearnPageSearchParameters.project) || '',
    learnPage: queryParameters.get(LearnPageSearchParameters.page) || '',
  };
}
