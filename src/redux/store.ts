import { configureStore } from '@reduxjs/toolkit';
import { activeLearnPageSlice } from 'redux/slices/activeLearnPage';
import { learnProjectsSlice } from 'redux/slices/learnProjectsSlice';
import { themeSlice } from 'redux/slices/themeSlice';
import { mainTerminalSlice } from './slices/mainTerminalSlice';
import { activeRouteSlice } from './slices/activeRoute';

export const store = configureStore({
  reducer: {
    activeLearnPage: activeLearnPageSlice.reducer,
    theme: themeSlice.reducer,
    learnProjects: learnProjectsSlice.reducer,
    mainTerminal: mainTerminalSlice.reducer,
    activeRoute: activeRouteSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
