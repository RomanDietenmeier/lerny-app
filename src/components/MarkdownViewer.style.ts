import { sizeRem } from 'constants/metrics';
import styled from 'styled-components';

export const MarkdownViewerWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  flex-direction: column;

  background-color: ${(p) => p.theme.backgroundMain};
`;

export const MarkdownViewerContentWrapper = styled.div`
  height: 100%;

  padding: 0 ${sizeRem.default.space};

  background-color: ${(p) => p.theme.backgroundMain};

  overflow-y: scroll;
  overflow-x: auto;
`;

export const MarkdownViewerTerminalWrapper = styled.div`
  padding: ${sizeRem.default.space};

  border-top: 1px solid ${(p) => p.theme.separatorColor};

  background-color: black;
`;
