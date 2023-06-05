import styled from 'styled-components';

type CodeEditorWrapperProps = {
  height: string;
};
export const CodeEditorWrapper = styled.div<CodeEditorWrapperProps>`
  height: ${(p) => p.height};
`;
