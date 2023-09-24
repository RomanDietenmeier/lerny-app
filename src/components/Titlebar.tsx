import { font } from 'constants/font';
import { RouterRoutes } from 'constants/routerRoutes';
import { Timeouts } from 'constants/timeouts';
import { useNavigateOnSelectedLearnPage } from 'hooks/LearnPageHooks';
import {
  useNavigateOnSelectedLearnProject,
  useSearchParamsOnSelectedLearnProject,
} from 'hooks/LearnProjectHooks';
import _ from 'lodash';
import { updateLearnProjects } from 'pages/StartPage';
import React from 'react';
import { Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';
import { selectCurrentTheme } from 'redux/selectors/themeSelectors';
import { themeChangeCurrentTheme } from 'redux/slices/themeSlice';
import { RowItemsFlex } from 'styles/layout.style';
import useAsyncEffect from 'use-async-effect';
import CloseIcon from '../icons/cross.svg';
import LogoIcon from '../icons/logo.svg';
import MinimizeIcon from '../icons/minus.svg';
import MaximizeIcon from '../icons/tabs.svg';
import {
  ControlButton,
  StyledMenu,
  TitlebarDrag,
  TitlebarMenu,
  TitlebarWrapper,
} from './Titlebar.style';

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
  const [onClickOnEditLearnProject] = useNavigateOnSelectedLearnProject(
    RouterRoutes.EditProjectPage
  );
  const [onClickOnEditLearnPage] = useNavigateOnSelectedLearnPage(
    RouterRoutes.EditProjectPage
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

  async function handleDeleteAndLeavePage() {
    const projectDirectory =
      await window.electron.learnProject.readProjectDirectory(learnProject);

    if (projectDirectory.length === 1) {
      await window.electron.learnProject.deleteProject(learnProject);
      navigate(RouterRoutes.Root);
    } else {
      const pageIndex = projectDirectory.indexOf(learnPage);
      if (pageIndex < 0) return;

      if (pageIndex === 0)
        onClickOnEditLearnPage(learnProject, projectDirectory[1]);
      else
        onClickOnEditLearnPage(learnProject, projectDirectory[pageIndex - 1]);
      const deletePageDebounced = _.debounce(
        async () =>
          await window.electron.learnPage.deleteLearnPage(
            learnProject,
            learnPage
          ),
        Timeouts.DebunceDeleteTimeout
      );
      deletePageDebounced();
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
            <Item
              disabled={currentPage !== RouterRoutes.EditProjectPage}
              onClick={async () => {
                const importedPage =
                  await window.electron.learnPage.importLearnPage(learnProject);
                if (!importedPage) return;
                onClickOnEditLearnPage(learnProject, importedPage);
              }}
            >
              import File
            </Item>
            <Item
              disabled={currentPage !== RouterRoutes.ProjectPage}
              onClick={() => {
                onClickOnEditLearnPage(learnProject, learnPage);
              }}
            >
              edit File
            </Item>
            <Separator />
            <Item
              disabled={currentPage !== RouterRoutes.EditProjectPage}
              onClick={handleDeleteAndLeavePage}
            >
              delete File
            </Item>
          </StyledMenu>
        </TitlebarMenu>

        <TitlebarMenu onClick={(event) => show({ id: PROJECT_MENU, event })}>
          Project
          <StyledMenu id={PROJECT_MENU}>
            <Item
              disabled={currentPage === RouterRoutes.Root}
              onClick={async () => {
                await window.electron.learnProject.exportProject(learnProject);
              }}
            >
              export Project
            </Item>
            <Item
              disabled={currentPage !== RouterRoutes.Root}
              onClick={async () => {
                await window.electron.learnProject.importProject();
                await updateLearnProjects();
              }}
            >
              import Project
            </Item>
            <Item
              disabled={currentPage !== RouterRoutes.ProjectPage}
              onClick={() => onClickOnEditLearnProject(learnProject)}
            >
              edit Project
            </Item>
            <Separator />
            <Item
              disabled={currentPage === RouterRoutes.Root}
              onClick={async () => {
                await window.electron.learnProject.deleteProject(learnProject);
                navigate(RouterRoutes.Root);
              }}
            >
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
          </StyledMenu>
        </TitlebarMenu>
        <TitlebarMenu onClick={(event) => show({ id: THEME_MENU, event })}>
          Style
          <StyledMenu id={THEME_MENU}>
            <Item onClick={swapTheme}>Swap theme</Item>
            <Submenu label="Editor Font Size">
              <Item
                onClick={() =>
                  window.electron.style.setFontSize(font.px.sizeSmall)
                }
              >
                Very Small
              </Item>
              <Item
                onClick={() =>
                  window.electron.style.setFontSize(font.px.sizeSmaller)
                }
              >
                Small
              </Item>
              <Item
                onClick={() =>
                  window.electron.style.setFontSize(font.px.sizeNormal)
                }
              >
                Default
              </Item>
              <Item
                onClick={() =>
                  window.electron.style.setFontSize(font.px.sizeBigger)
                }
              >
                Big
              </Item>
              <Item
                onClick={() =>
                  window.electron.style.setFontSize(font.px.sizeBig)
                }
              >
                Very Big
              </Item>
            </Submenu>
          </StyledMenu>
        </TitlebarMenu>
      </RowItemsFlex>
      <TitlebarDrag />
      <ControlButtons />
    </TitlebarWrapper>
  );
}
