import { AppWrapper } from 'App.style';
import { RouterRoutes } from 'constants/routerRoutes';
import { CreateLearnPage } from 'pages/CreateLearnPage';
import { EditSelectionPage } from 'pages/EditSelectionPage';
import { LearnPage } from 'pages/LearnPage';
import { StartPage } from 'pages/StartPage';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { selectCurrentTheme } from 'redux/selectors/themeSelectors';
import { themeChangeCurrentTheme } from 'redux/slices/themeSlice';
import { ThemeProvider } from 'styled-components';

export function App() {
  const navigate = useNavigate();
  const { pathname: pagePathName } = useLocation();
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
          <Route path={RouterRoutes.LearnPage} element={<LearnPage />} />
          <Route
            path={RouterRoutes.SelectLearnPageToEdit}
            element={<EditSelectionPage />}
          />
          <Route
            path="*"
            element={
              <div style={{ color: '#fff' }}>
                <h2>&quot;{pagePathName}&quot; does not exist yet</h2>
                <NavLink to="/">ROOT</NavLink>
              </div>
            }
          />
        </Routes>
      </AppWrapper>
    </ThemeProvider>
  );
}
