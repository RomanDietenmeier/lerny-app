import { font } from 'constants/font';
import { sizeRem } from 'constants/metrics';
import styled from 'styled-components';
import { RowItemsSpacedHalf } from 'styles/layout.style';

export const CodeBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${sizeRem.default.spaceHalf};

  color: ${(p) => p.theme.primary};
  background-color: ${(p) => p.theme.backgroundSecondary};

  font-size: ${font.sizeNormal};

  > *:not(:last-child) {
    margin-bottom: ${sizeRem.default.spaceHalf};
  }

  .monaco-editor {
    background-color: ${(p) => p.theme.backgroundMain};
  }
  .monaco-editor-background {
    background-color: ${(p) => p.theme.backgroundMain};
  }
  .monaco-editor {
    background-color: ${(p) => p.theme.backgroundMain};
  }
  .monaco-editor .margin {
    background-color: ${(p) => p.theme.backgroundMain};
  }
`;

export const CodeBlockAttribute = styled(RowItemsSpacedHalf)`
  align-items: baseline;
`;

export const CodeBlockInput = styled.input`
  width: ${sizeRem.projectPage.inputWidth};
  padding: 0 ${sizeRem.default.spaceHalf};

  background-color: ${(p) => p.theme.backgroundMain};
  color: ${(p) => p.theme.primary};

  border: none;
  border-radius: ${sizeRem.default.borderRadius};
  font-size: ${font.sizeNormal};
  outline: none;
`;

export const CodeBlockInputFill = styled(CodeBlockInput)`
  width: 100%;
`;

export const CodeBlockSelect = styled.select`
  width: ${sizeRem.projectPage.inputWidth};
  padding: 0 ${sizeRem.default.spaceHalf};

  background-color: ${(p) => p.theme.backgroundMain};
  color: ${(p) => p.theme.primary};

  border: none;
  border-radius: ${sizeRem.default.borderRadius};
  font-size: ${font.sizeNormal};
  outline: none;
`;
