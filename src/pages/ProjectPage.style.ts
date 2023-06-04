import { font } from 'constants/font';
import { size, sizeRem } from 'constants/metrics';
import styled from 'styled-components';

export const ProjectPageWrapper = styled.div`
  display: flex;
  height: 100%;

  color: ${(p) => p.theme.primary};
  background-color: ${(p) => p.theme.backgroundMain};
`;

export const ProjectPagePane = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  width: ${sizeRem.pane.width};
  height: 100%;

  border-right: 1px solid ${(p) => p.theme.separatorColor};

  background-color: ${(p) => p.theme.backgroundSecondary};
`;
export const ProjectPagePaneBar = styled.div`
  display: flex;

  height: ${sizeRem.pane.barHeight};
  padding: 0 ${sizeRem.pane.padding};

  justify-content: space-between;
  align-items: center;

  img {
    cursor: pointer;
  }
`;
export const ProjectPagePaneExplorer = styled.div`
  display: flex;
  flex-direction: column;

  padding: ${sizeRem.pane.padding};
  padding-top: 0;

  font-size: ${font.sizeBig};
  font-weight: ${font.bold};

  border-top: 1px solid ${(p) => p.theme.primary};

  > *:not(:last-child) {
    margin-bottom: ${sizeRem.default.space};
  }
`;
export const ProjectPagePaneSectionName = styled.div`
  width: fit-content;
  padding: 0 ${sizeRem.default.space};

  align-self: center;

  background-color: ${(p) => p.theme.backgroundSecondary};
  font-size: ${font.sizeSmaller};

  transform: translateY(-0.8rem);
`;

type ProjectPagePaneFileProps = {
  active: boolean;
};
export const ProjectPagePaneFile = styled.div<ProjectPagePaneFileProps>`
  padding: ${size.default.spaceHalf / 2}rem ${sizeRem.default.spaceHalf};

  background-color: ${(p) =>
    p.active ? p.theme.primary : p.theme.backgroundSecondary};
  color: ${(p) => (p.active ? p.theme.backgroundSecondary : p.theme.primary)};

  font-size: ${font.sizeNormal};

  border: 1px solid ${(p) => p.theme.primary};
  border-radius: ${sizeRem.default.borderRadius};

  cursor: pointer;
`;
