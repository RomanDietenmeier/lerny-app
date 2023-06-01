import { font } from 'constants/font';
import { sizeRem } from 'constants/metrics';
import { Menu } from 'react-contexify';
import styled from 'styled-components';

export const TitlebarWrapper = styled.div`
  display: flex;
  position: relative;

  height: ${sizeRem.titlebar.height};
  width: 100%;

  align-items: center;

  background-color: ${(p) => p.theme.titlebar};
  color: ${(p) => p.theme.primary};

  font-size: ${font.sizeNormal};

  -webkit-user-select: none;

  img {
    scale: 0.65;
  }
`;

export const StyledMenu = styled(Menu)`
  border: 1px solid ${(p) => p.theme.primary};
  --contexify-menu-bgColor: ${(p) => p.theme.titlebar};
  --contexify-separator-color: ${(p) => p.theme.primary};
  --contexify-item-color: ${(p) => p.theme.primary};
  --contexify-activeItem-color: #fff;
  --contexify-activeItem-bgColor: ${(p) => p.theme.titlebarHover};
  --contexify-rightSlot-color: ${(p) => p.theme.primary};
  --contexify-activeRightSlot-color: #fff;
  --contexify-arrow-color: ${(p) => p.theme.primary};
  --contexify-activeArrow-color: #fff;
`;

export const TitlebarMenu = styled.div`
  display: flex;
  height: 100%;
  padding: 0 ${sizeRem.default.space};

  align-items: center;
  justify-content: center;

  cursor: pointer;

  &:hover {
    background-color: ${(p) => p.theme.titlebarHover};
  }
`;

export const TitlebarDrag = styled.div`
  width: 100%;
  height: 100%;

  -webkit-app-region: drag;
`;

export const ControlButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: ${sizeRem.titlebar.controlButtonWidth};

  cursor: pointer;
  &:hover {
    background-color: ${(p) => p.theme.titlebarHover};
  }
`;
