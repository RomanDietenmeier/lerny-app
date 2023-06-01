import { AppWrapper as Wrapper } from 'App.style';
import { Titlebar } from 'components/Titlebar';
import { RouterRoutes } from 'constants/routerRoutes';
import { useSearchParamsOnSelectedLearnPage } from 'hooks/LearnPageHooks';
import { CreateLearnPage } from 'pages/CreateLearnPage';
import { EditSelectionPage } from 'pages/EditSelectionPage';
import { ExportLearnProject } from 'pages/ExportLearnProject';
import { LearnPage } from 'pages/LearnPage';
import { StartPage } from 'pages/StartPage';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { selectCurrentTheme } from 'redux/selectors/themeSelectors';
import { setActiveLearnPage } from 'redux/slices/activeLearnPage';
import { ThemeProvider } from 'styled-components';

export function App() {
  const dispatch = useDispatch();
  const { pathname: pagePathName } = useLocation();
  const activeLearnPage = useSearchParamsOnSelectedLearnPage();
  const currentTheme = useSelector(selectCurrentTheme);

  useEffect(() => {
    dispatch(setActiveLearnPage(activeLearnPage));
  }, [activeLearnPage]);

  useEffect(() => {
    document.body.style.setProperty(
      'background-color',
      currentTheme.styledComponentsTheme.backgroundColor
    );
    document
      .getElementById('BackgroundBanner')
      ?.style.setProperty(
        '-webkit-text-stroke-color',
        currentTheme.styledComponentsTheme.color
      );
  }, [currentTheme]);

  return (
    <ThemeProvider theme={currentTheme.styledComponentsTheme}>
      <Wrapper>
        <Titlebar />
        <Routes>
          <Route path={RouterRoutes.Root} element={<StartPage />} />

          <Route
            path={RouterRoutes.CreateLearnPage}
            element={<CreateLearnPage />}
          />
          <Route
            path={RouterRoutes.ExportLearnProject}
            element={<ExportLearnProject />}
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
      </Wrapper>
    </ThemeProvider>
  );
}
