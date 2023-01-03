import { RootState } from '../store';

export function selectLearnProjects(state: RootState) {
  return state.learnProjects;
}
