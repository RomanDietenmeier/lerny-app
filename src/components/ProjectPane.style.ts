import { font } from 'constants/font';
import { size, sizeRem } from 'constants/metrics';
import styled from 'styled-components';

export const ProjectPaneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  width: ${sizeRem.pane.width};
  height: 100%;

  justify-content: space-between;

  border-right: 1px solid ${(p) => p.theme.separatorColor};

  background-color: ${(p) => p.theme.backgroundSecondary};
`;
export const ProjectPaneBar = styled.div`
  display: flex;

  height: ${sizeRem.pane.barHeight};
  padding: 0 ${sizeRem.pane.padding};

  justify-content: space-between;
  align-items: center;

  img {
    cursor: pointer;
  }
`;
export const ProjectPaneExplorer = styled.div`
  display: flex;
  flex-direction: column;

  flex-grow: 0;

  padding: ${sizeRem.pane.padding};
  padding-top: 0;

  font-size: ${font.sizeBig};
  font-weight: ${font.bold};

  border-top: 1px solid ${(p) => p.theme.primary};
`;
export const ProjectPaneDirectory = styled(ProjectPaneExplorer)`
  height: ${size.terminal.height + size.default.space}rem;
`;

export const ProjectPaneSectionName = styled.div`
  width: fit-content;
  padding: 0 ${sizeRem.default.space};

  align-self: center;

  background-color: ${(p) => p.theme.backgroundSecondary};
  font-size: ${font.sizeSmaller};

  transform: translateY(-0.8rem);
`;

export const ProjectPaneFileWrapper = styled.div`
  display: flex;
  flex-direction: column;

  overflow: overlay;

  > *:not(:last-child) {
    margin-bottom: ${sizeRem.default.space};
  }
`;

type ProjectPaneFileProps = {
  active: boolean;
};
export const ProjectPaneFile = styled.div<ProjectPaneFileProps>`
  padding: ${size.default.spaceHalf / 2}rem ${sizeRem.default.spaceHalf};

  background-color: ${(p) =>
    p.active ? p.theme.primary : p.theme.backgroundSecondary};
  color: ${(p) => (p.active ? p.theme.backgroundSecondary : p.theme.primary)};

  font-size: ${font.sizeNormal};

  border: 1px solid ${(p) => p.theme.primary};
  border-radius: ${sizeRem.default.borderRadius};

  &:hover {
    background-color: ${(p) => (p.active ? p.theme.primary : p.theme.titlebar)};
  }
`;

export const ProjectPaneProject = styled.div`
  display: flex;
  margin-bottom: ${sizeRem.default.space};

  justify-content: space-between;

  img {
    cursor: pointer;
  }
`;
