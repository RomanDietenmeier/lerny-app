import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppWrapper } from './App.style';
import { RouterRoutes } from './constants/RouterRoutes';
import { CreateLearnPage } from './pages/CreateLearnPage';
import { StartPage } from './pages/StartPage';
import { selectCurrentTheme } from './redux/selectors/themeSelectors';
import { themeChangeCurrentTheme } from './redux/slices/themeSlice';

export function App() {
  const navigate = useNavigate();
  const currentTheme = useSelector(selectCurrentTheme);
  const dispatch = useDispatch();
  function swapTheme() {
    if (currentTheme.monacoEditorTheme == 'vs-dark') {
      dispatch(themeChangeCurrentTheme('white'));
    } else {
      dispatch(themeChangeCurrentTheme('dark'));
    }
  }

  return (
    <ThemeProvider theme={currentTheme.styledComponentsTheme}>
      <AppWrapper>
        <button onClick={swapTheme}>SWAP THEME</button>
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          GO BACK
        </button>
        <Routes>
          <Route path={RouterRoutes.Root} element={<StartPage />} />
          <Route
            path={RouterRoutes.CreateLearnPage}
            element={<CreateLearnPage />}
          />
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
      </AppWrapper>
    </ThemeProvider>
  );
}
