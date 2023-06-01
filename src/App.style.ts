import { font } from 'constants/font';
import styled from 'styled-components';

export const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${(p) => p.theme.primary};
  background-color: ${(p) => p.theme.backgroundMain};
  overflow: hidden;

  font-family: ${font.family};
  font-size: ${font.sizeNormal};
`;
