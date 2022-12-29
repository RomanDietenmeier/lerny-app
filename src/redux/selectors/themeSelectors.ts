import { RootState } from '../store';

export function selectCurrentTheme(state: RootState) {
  return state.theme.themes[state.theme.currentTheme];
}
