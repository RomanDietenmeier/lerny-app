import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { StartPage } from './pages/StartPage';
import { themeChangeCurrentTheme } from './redux/slices/themeSlice';
import { RootState } from './redux/store';

export function App() {
  const themeState = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  function swapTheme() {
    if (themeState.currentTheme == 'dark') {
      dispatch(themeChangeCurrentTheme('white'));
    } else {
      dispatch(themeChangeCurrentTheme('dark'));
    }
  }

  return (
    <ThemeProvider theme={themeState.themes[themeState.currentTheme]}>
      <HashRouter>
        <button onClick={swapTheme}>SWAP THEME</button>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/create" element={<NavLink to="/">ROOT</NavLink>} />
          <Route
            path="*"
            element={
              <div style={{ color: '#fff' }}>
                <div>ERROR</div>
                <NavLink to="/">ROOT</NavLink>
              </div>
            }
          />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
