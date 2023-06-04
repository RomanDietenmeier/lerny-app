import { useNavigate, useSearchParams } from 'react-router-dom';

export const enum LearnPageSearchParameters {
  project = 'project',
  page = 'page',
}

export function useNavigateOnSelectedLearnPage(targetRoute: string) {
  const navigate = useNavigate();
  function onClickOnLearnPage(project: string, page: string) {
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
