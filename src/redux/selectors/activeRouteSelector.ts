import { RootState } from '../store';

export function selectActiveRoute(state: RootState) {
  return state.activeRoute;
}
