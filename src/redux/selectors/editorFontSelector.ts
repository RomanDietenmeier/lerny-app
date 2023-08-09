import { RootState } from '../store';

export function selectEditorFont(state: RootState) {
  return state.editorFont;
}
