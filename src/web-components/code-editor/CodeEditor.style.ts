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
