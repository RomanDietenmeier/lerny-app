import styled from 'styled-components';

export const MarkdownViewerWrapper = styled.div`
  height: 100%;
  width: 100%;

  background-color: ${(p) => p.theme.backgroundColor};

  overflow-y: scroll;
  overflow-x: auto;

  ::-webkit-scrollbar {
    background-color: ${(p) => p.theme.backgroundColor};
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #4f4f4f;
  }
`;
