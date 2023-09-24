import { configureStore } from '@reduxjs/toolkit';
import { activeLearnPageSlice } from 'redux/slices/activeLearnPage';
import { activeRouteSlice } from 'redux/slices/activeRoute';
import { editorFontSlice } from 'redux/slices/editorFontSlice';
import { learnProjectsSlice } from 'redux/slices/learnProjectsSlice';
import { mainTerminalSlice } from 'redux/slices/mainTerminalSlice';
import { themeSlice } from 'redux/slices/themeSlice';

export const store = configureStore({
  reducer: {
    activeLearnPage: activeLearnPageSlice.reducer,
    theme: themeSlice.reducer,
    learnProjects: learnProjectsSlice.reducer,
    mainTerminal: mainTerminalSlice.reducer,
    activeRoute: activeRouteSlice.reducer,
    editorFont: editorFontSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
