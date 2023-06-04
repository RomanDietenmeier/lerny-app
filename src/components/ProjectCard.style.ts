import { font } from 'constants/font';
import { size, sizeRem } from 'constants/metrics';
import styled from 'styled-components';
import { StyledMenu } from './Titlebar.style';

export const ProjectCardWrapper = styled.div`
  width: ${sizeRem.projectCard.width};
  height: ${sizeRem.projectCard.height};
  margin: ${sizeRem.default.spaceBig};

  cursor: pointer;

  img {
    position: absolute;
    transform: translate(
      ${(size.projectCard.width - size.projectCard.offset) / 2 -
      size.projectCard.offset -
      size.projectCard.padding}rem,
      ${-(size.projectCard.height - size.projectCard.offset) / 2 +
      size.projectCard.padding}rem
    );
  }
`;

export const ProjectCardLayer = styled.div`
  position: absolute;
  width: ${size.projectCard.width - size.projectCard.offset}rem;
  height: ${size.projectCard.height - size.projectCard.offset}rem;

  background-color: ${(p) => p.theme.primary};

  border: 1px solid ${(p) => p.theme.backgroundMain};
  border-radius: ${sizeRem.default.borderRadius};
`;

export const ProjectCardTopLayer = styled(ProjectCardLayer)`
  display: flex;

  align-items: center;
  justify-content: center;

  font-size: ${font.sizeBig};
  color: ${(p) => p.theme.backgroundMain};

  z-index: 2;
`;

export const ProjectCardMiddleLayer = styled(ProjectCardLayer)`
  z-index: 1;
  transform: translate(
    ${size.projectCard.offset / 2}rem,
    ${size.projectCard.offset / 2}rem
  );
`;

export const ProjectCardBottomLayer = styled(ProjectCardLayer)`
  transform: translate(
    ${size.projectCard.offset}rem,
    ${size.projectCard.offset}rem
  );
`;

export const StyledProjectMenu = styled(StyledMenu)`
  --contexify-menu-bgColor: ${(p) => p.theme.backgroundMain};

  --contexify-activeItem-bgColor: ${(p) => p.theme.backgroundSecondary};
`;
