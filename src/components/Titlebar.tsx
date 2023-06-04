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
import { useNavigate } from 'react-router';
import { RouterRoutes } from 'constants/routerRoutes';

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

  function swapTheme() {
    if (currentTheme.monacoEditorTheme == 'vs-dark') {
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
            <Item>new File</Item>
            <Item>export File</Item>
            <Item>edit File</Item>
            <Separator />
            <Item>save File</Item>
            <Item>save File as...</Item>
            <Separator />
            <Item>delete File</Item>
          </StyledMenu>
        </TitlebarMenu>

        <TitlebarMenu onClick={(event) => show({ id: PROJECT_MENU, event })}>
          Project
          <StyledMenu id={PROJECT_MENU}>
            <Item>new Project</Item>
            <Item>export Project</Item>
            <Item>import Project</Item>
            <Item>edit Project</Item>
            <Separator />
            <Item>save Project</Item>
            <Item>save Project as...</Item>
            <Separator />
            <Item>delete Project</Item>
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
              <Item>Dummyproject1</Item>
              <Item>Dummyproject2</Item>
            </Submenu>
            <Item>create Project</Item>
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
