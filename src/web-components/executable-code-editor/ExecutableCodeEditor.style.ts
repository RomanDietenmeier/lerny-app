import { sizeRem } from 'constants/metrics';
import styled from 'styled-components';

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
