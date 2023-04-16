import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { DefaultTheme } from 'styled-components';
import { defaultTheme, whiteTheme } from '../../styles/defaultTheme';

const MonacoEditorDefaultTheme = 'vs-dark';

type Theme = {
  styledComponentsTheme: DefaultTheme;
  monacoEditorTheme: string;
};

export type ThemeState = {
  themes: Record<string, Theme>;
  currentTheme: string;
};

const initialState: ThemeState = {
  themes: {
    dark: {
      styledComponentsTheme: defaultTheme,
      monacoEditorTheme: MonacoEditorDefaultTheme,
    },
    white: { styledComponentsTheme: whiteTheme, monacoEditorTheme: 'vs-light' },
  },
  currentTheme: 'dark',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    themeChangeCurrentTheme: (state, action: PayloadAction<string>) => {
      state.currentTheme = action.payload;
    },
    themeAddTheme: (
      state,
      action: PayloadAction<{
        theme?: DefaultTheme;
        monacoEditorTheme?: string;
        name: string;
      }>
    ) => {
      state.themes[action.payload.name] = {
        styledComponentsTheme: action.payload.theme ?? defaultTheme,
        monacoEditorTheme:
          action.payload.monacoEditorTheme ?? MonacoEditorDefaultTheme,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { themeChangeCurrentTheme, themeAddTheme } = themeSlice.actions;
