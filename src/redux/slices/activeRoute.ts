import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouterRoutes } from 'constants/routerRoutes';

export type ActiveRoute = { route: RouterRoutes | null };

const initialState: ActiveRoute = { route: null };

export const activeRouteSlice = createSlice({
  name: 'activeRoute',
  initialState,
  reducers: {
    setActiveRoute(state, action: PayloadAction<ActiveRoute>) {
      return action.payload;
    },
  },
});

export const { setActiveRoute } = activeRouteSlice.actions;
