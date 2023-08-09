import React from 'react';
import {
  ControlButton,
  StyledMenu,
  TitlebarDrag,
  TitlebarMenu,
  TitlebarWrapper,
} from './Titlebar.style';
import LogoIcon from '../icons/logo.svg';
import CloseIcon from '../icons/cross.svg';
import MaximizeIcon from '../icons/tabs.svg';
import MinimizeIcon from '../icons/minus.svg';
import { RowItemsFlex } from 'styles/layout.style';
import { Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { themeChangeCurrentTheme } from 'redux/slices/themeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentTheme } from 'redux/selectors/themeSelectors';
import { useLocation, useNavigate } from 'react-router';
import { RouterRoutes } from 'constants/routerRoutes';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';
import { updateLearnProjects } from 'pages/StartPage';
import useAsyncEffect from 'use-async-effect';
import {
  useNavigateOnSelectedLearnProject,
  useSearchParamsOnSelectedLearnProject,
} from 'hooks/LearnProjectHooks';

const FILE_MENU = 'file-id';
const PROJECT_MENU = 'project-id';
const NAVIGATE_MENU = 'navigate-id';
const THEME_MENU = 'theme-id';

function ControlButtons(): JSX.Element {
  function handleClickMinimize() {
    window.electron.titlebar.minimizeApp();
  }
  function handleClickMaximize() {
    window.electron.titlebar.maximizeRestoreApp();
  }
  function handleClickClose() {
    window.electron.titlebar.closeApp();
  }
  return (
    <RowItemsFlex>
      <ControlButton onClick={handleClickMinimize}>
        <img src={MinimizeIcon} />
      </ControlButton>
      <ControlButton onClick={handleClickMaximize}>
        <img src={MaximizeIcon} />
      </ControlButton>
      <ControlButton onClick={handleClickClose}>
        <img src={CloseIcon} />
      </ControlButton>
    </RowItemsFlex>
  );
}

export function Titlebar(): JSX.Element {
  const { show } = useContextMenu();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentTheme = useSelector(selectCurrentTheme);
  const currentPage = useLocation().pathname;
  const learnProjects = useSelector(selectLearnProjects);
  const { learnProject, learnPage } = useSearchParamsOnSelectedLearnProject();

  const [onClickOnLearnProject] = useNavigateOnSelectedLearnProject(
    RouterRoutes.ProjectPage
  );

  useAsyncEffect(async () => {
    await updateLearnProjects();
  }, []);

  function swapTheme() {
    if (currentTheme.monacoEditorTheme == 'lerny-dark') {
      dispatch(themeChangeCurrentTheme('white'));
    } else {
      dispatch(themeChangeCurrentTheme('dark'));
    }
  }

  return (
    <TitlebarWrapper>
      <RowItemsFlex>
        <img src={LogoIcon} />
        <TitlebarMenu onClick={(event) => show({ id: FILE_MENU, event })}>
          File
          <StyledMenu id={FILE_MENU}>
            <Item disabled={currentPage !== RouterRoutes.EditProjectPage}>
              new File
            </Item>
            <Item
              disabled={currentPage === RouterRoutes.Root}
              onClick={() =>
                window.electron.learnPage.exportLearnPage(
                  learnProject,
                  learnPage
                )
              }
            >
              export File
            </Item>
            <Item disabled={currentPage !== RouterRoutes.EditProjectPage}>
              import File
            </Item>
            <Item disabled={currentPage !== RouterRoutes.ProjectPage}>
              edit File
            </Item>
            <Separator />
            <Item disabled={currentPage === RouterRoutes.Root}>save File</Item>
            <Item disabled={currentPage !== RouterRoutes.EditProjectPage}>
              save File as...
            </Item>
            <Separator />
            <Item disabled={currentPage !== RouterRoutes.EditProjectPage}>
              delete File
            </Item>
          </StyledMenu>
        </TitlebarMenu>

        <TitlebarMenu onClick={(event) => show({ id: PROJECT_MENU, event })}>
          Project
          <StyledMenu id={PROJECT_MENU}>
            <Item>new Project</Item>
            <Item disabled={currentPage === RouterRoutes.Root}>
              export Project
            </Item>
            <Item disabled={currentPage !== RouterRoutes.Root}>
              import Project
            </Item>
            <Item disabled={currentPage !== RouterRoutes.ProjectPage}>
              edit Project
            </Item>
            <Separator />
            <Item disabled={currentPage === RouterRoutes.Root}>
              save Project
            </Item>
            <Item disabled={currentPage === RouterRoutes.Root}>
              save Project as...
            </Item>
            <Separator />
            <Item disabled={currentPage === RouterRoutes.Root}>
              delete Project
            </Item>
          </StyledMenu>
        </TitlebarMenu>
        <TitlebarMenu onClick={(event) => show({ id: NAVIGATE_MENU, event })}>
          Navigate
          <StyledMenu id={NAVIGATE_MENU}>
            <Item
              onClick={() => {
                navigate(-1);
              }}
            >
              Go back
            </Item>
            <Separator />
            <Item
              onClick={() => {
                navigate(RouterRoutes.Root);
              }}
            >
              Projectlist
            </Item>
            <Submenu label="Project...">
              {Object.entries(learnProjects).map((project, index) => (
                <Item
                  key={index}
                  onClick={() => {
                    onClickOnLearnProject(project[0]);
                  }}
                >
                  {project[0]}
                </Item>
              ))}
            </Submenu>
            <Item onClick={() => navigate(RouterRoutes.EditProjectPage)}>
              create Project
            </Item>
          </StyledMenu>
        </TitlebarMenu>
        <TitlebarMenu onClick={(event) => show({ id: THEME_MENU, event })}>
          Theme
          <StyledMenu id={THEME_MENU}>
            <Item onClick={swapTheme}>Swap theme</Item>
          </StyledMenu>
        </TitlebarMenu>
      </RowItemsFlex>
      <TitlebarDrag />
      <ControlButtons />
    </TitlebarWrapper>
  );
}
