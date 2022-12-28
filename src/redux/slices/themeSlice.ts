import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DefaultTheme } from 'styled-components';
import { defaultTheme, whiteTheme } from '../../styles/defaultTheme';

export type ThemeState = {
  themes: Record<string, DefaultTheme>;
  currentTheme: string;
};

const initialState: ThemeState = {
  themes: { dark: defaultTheme, white: whiteTheme },
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
      action: PayloadAction<{ theme: DefaultTheme; name: string }>
    ) => {
      state.themes[action.payload.name] = action.payload.theme;
    },
  },
});

// Action creators are generated for each case reducer function
export const { themeChangeCurrentTheme, themeAddTheme } = themeSlice.actions;
