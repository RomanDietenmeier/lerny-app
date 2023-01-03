import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LearnProjects = Record<string, Array<string>>;

const initialState: LearnProjects = {};

export const learnProjectsSlice = createSlice({
  name: 'learnProjects',
  initialState,
  reducers: {
    setLearnProjects(state, action: PayloadAction<LearnProjects>) {
      return action.payload;
    },
  },
});

export const { setLearnProjects } = learnProjectsSlice.actions;
