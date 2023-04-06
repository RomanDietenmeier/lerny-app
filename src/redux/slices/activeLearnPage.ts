import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ActiveLearnPage = {
  learnPage: string | null;
  learnProject: string | null;
};

const initialState: ActiveLearnPage = {
  learnPage: null,
  learnProject: null,
};

export const activeLearnPageSlice = createSlice({
  name: 'activeLearnPage',
  initialState,
  reducers: {
    setActiveLearnPage(state, action: PayloadAction<ActiveLearnPage>) {
      return action.payload;
    },
  },
});

export const { setActiveLearnPage } = activeLearnPageSlice.actions;
