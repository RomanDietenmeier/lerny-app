import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MainTerminal = { id: number | null };

const initialState: MainTerminal = { id: null };

export const mainTerminalSlice = createSlice({
  name: 'mainTerminal',
  initialState,
  reducers: {
    setMainTerminal(state, action: PayloadAction<MainTerminal>) {
      return action.payload;
    },
  },
});

export const { setMainTerminal } = mainTerminalSlice.actions;
