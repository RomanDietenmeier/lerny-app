import { font } from 'constants/font';
import { size, sizeRem } from 'constants/metrics';
import styled from 'styled-components';
import { ProjectCardLayer } from './ProjectCard.style';

export const ProjectAddCardWrapper = styled.div`
  width: ${sizeRem.projectCard.width};
  height: ${sizeRem.projectCard.height};
  margin: ${sizeRem.default.spaceBig};

  cursor: pointer;

  img {
    scale: 0.75;
  }
`;
const ProjectAddCardLayer = styled(ProjectCardLayer)`
  background-color: ${(p) => p.theme.backgroundMain};

  border: 1px solid ${(p) => p.theme.primary};
  border-radius: ${sizeRem.default.borderRadius};
`;
export const ProjectAddCardTopLayer = styled(ProjectAddCardLayer)`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  z-index: 2;
`;

export const ProjectAddCardMiddleLayer = styled(ProjectAddCardLayer)`
  z-index: 1;
  transform: translate(
    ${size.projectCard.offset / 2}rem,
    ${size.projectCard.offset / 2}rem
  );
`;

export const ProjectAddCardBottomLayer = styled(ProjectAddCardLayer)`
  transform: translate(
    ${size.projectCard.offset}rem,
    ${size.projectCard.offset}rem
  );
`;

export const ProjectAddCardOption = styled.div`
  display: flex;
  width: 100%;
  height: ${(size.projectCard.height - size.projectCard.offset) / 2}rem;

  align-items: center;
  justify-content: center;

  font-size: ${font.sizeBigger};

  border-radius: ${sizeRem.default.borderRadius} ${sizeRem.default.borderRadius}
    0 0;
  border-bottom: 1px solid ${(p) => p.theme.primary};

  &:hover {
    background-color: ${(p) => p.theme.backgroundSecondary};
  }
`;
export const ProjectAddCardInput = styled.input`
  display: flex;
  width: 100%;
  height: ${(size.projectCard.height - size.projectCard.offset) / 2}rem;

  padding: 0 ${sizeRem.default.spaceHalf};

  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  color: ${(p) => p.theme.primary};
  background-color: ${(p) => p.theme.backgroundMain};

  font-size: ${font.sizeBigger};

  border-radius: ${sizeRem.default.borderRadius} ${sizeRem.default.borderRadius}
    0 0;
  border: 0;
  border-bottom: 1px solid ${(p) => p.theme.primary};
  outline: none;

  &:hover {
    background-color: ${(p) => p.theme.backgroundSecondary};
  }
`;
export const ProjectAddCardLastOption = styled(ProjectAddCardOption)`
  border-radius: 0 0 ${sizeRem.default.borderRadius}
    ${sizeRem.default.borderRadius};
  border-bottom: 0;
`;
