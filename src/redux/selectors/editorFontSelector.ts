import { RootState } from 'redux/store';

export function selectEditorFont(state: RootState) {
  return state.editorFont;
}
