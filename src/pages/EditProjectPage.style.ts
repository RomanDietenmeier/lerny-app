import { font } from 'constants/font';
import { sizeRem } from 'constants/metrics';
import styled from 'styled-components';

export const EditProjectPageWrapper = styled.div`
  display: flex;
  height: calc(100vh - ${sizeRem.titlebar.height} - 1px);

  color: ${(p) => p.theme.primary};
  background-color: ${(p) => p.theme.backgroundMain};
`;

export const EditProjectPageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const EditProjectPageButtonWrapper = styled.div`
  width: 100%;
  height: ${sizeRem.projectPage.buttonHeight};

  flex-shrink: 0;

  background-color: ${(p) => p.theme.backgroundSecondary};
`;

//disabled, when active
export const EditProjectPageButton = styled.button`
  position: relative;
  width: ${sizeRem.projectPage.buttonWidth};
  height: 100%;

  border-radius: ${sizeRem.default.borderRadius} ${sizeRem.default.borderRadius}
    0 0;

  background-color: ${(p) => p.theme.backgroundMain};

  color: ${(p) => p.theme.primaryDisabled};
  border: 4px solid ${(p) => p.theme.backgroundSecondary};
  cursor: pointer;

  &:disabled {
    color: ${(p) => p.theme.primary};
    border: 0;
    cursor: default;
  }
`;

export const EditProjectPageEditorWrapper = styled.div`
  padding: 0 ${sizeRem.default.space};

  overflow: scroll;

  > *:not(:last-child) {
    margin-bottom: ${sizeRem.default.spaceHalf};
  }
`;
export const EditProjectPageTitleWrapper = styled.div`
  display: flex;
  align-items: center;

  font-size: ${font.sizeBigger};
`;
export const EditProjectPageTitleInput = styled.input`
  width: ${sizeRem.projectPage.inputWidth};
  padding: 0 ${sizeRem.default.spaceHalf};
  margin: ${sizeRem.default.spaceHalf};

  background-color: ${(p) => p.theme.backgroundSecondary};
  color: ${(p) => p.theme.primary};

  border: none;
  border-radius: ${sizeRem.default.borderRadius};
  font-size: ${font.sizeBigger};
  outline: none;
`;
