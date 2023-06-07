import { sizeRem } from 'constants/metrics';
import styled from 'styled-components';

type CodeEditorWrapperProps = {
  height: string;
};
export const CodeEditorWrapper = styled.div<CodeEditorWrapperProps>`
  height: ${(p) => p.height};

  padding: ${sizeRem.default.spaceHalf} 0;

  background-color: ${(p) => p.theme.backgroundSecondary};
`;

export const CodeEditorButtonsWrapper = styled.div`
  display: flex;

  width: fit-content;

  background-color: ${(p) => p.theme.backgroundSecondary};
`;
export const CodeEditorButtonWrapper = styled.div`
  display: flex;

  padding: 0 ${sizeRem.default.spaceHalf};

  cursor: pointer;

  img {
    scale: 0.66;
  }

  &:hover {
    background-color: ${(p) => p.theme.titlebar};
  }
`;
