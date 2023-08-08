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
`;
export const EditProjectPageTitleWrapper = styled.div`
  display: flex;
  align-items: center;

  font-size: ${font.sizeBigger};

  img {
    cursor: pointer;
    transform: scale(0.75);
  }
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

export const EditProjectPageBlocksWrapper = styled.div`
  > *:not(:last-child) {
    margin-bottom: ${sizeRem.default.spaceHalf};
  }
`;
export const EditProjectPageBlocksButtonWrapper = styled.div`
  display: flex;
  position: relative;

  width: fit-content;

  padding: 0 0.5rem;
  margin-left: auto;

  top: 0.5rem;

  z-index: 2;
`;

export const EditProjectPageBlockButton = styled.div`
  display: flex;
  height: 1rem;
  width: 1.5rem;

  justify-content: center;

  border: 1px solid transparent;
  background-color: ${(p) => p.theme.titlebar};

  &:hover {
    background-color: ${(p) => p.theme.titlebarHover};
  }
`;

export const EditProjectPageSeperatorButtonWrapper = styled.div`
  display: flex;
  height: 0.25rem;

  background-color: ${(p) => p.theme.backgroundSecondary};

  overflow: hidden;

  border: none;
  border-radius: ${sizeRem.default.borderRadius};
  font-size: ${font.sizeNormal};

  transition: height 0.5s;
  transition-delay: 0.25s;

  &:hover {
    height: 2rem;
    background-color: ${(p) => p.theme.titlebar};
  }
`;

export const EditProjectPageSeperatorButton = styled.div`
  display: flex;

  width: 100%;
  height: 100%;

  justify-content: center;

  background-color: transparent;
  color: ${(p) => p.theme.primary};

  font-size: ${font.sizeNormal};

  border: none;

  cursor: pointer;

  &:hover {
    background-color: ${(p) => p.theme.titlebarHover};
  }
`;
