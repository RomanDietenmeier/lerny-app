import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorFont = { size: number | null };

const initialState: EditorFont = { size: null };

export const editorFontSlice = createSlice({
  name: 'editorFont',
  initialState,
  reducers: {
    setEditorFont(state, action: PayloadAction<EditorFont>) {
      return action.payload;
    },
  },
});

export const { setEditorFont } = editorFontSlice.actions;
