import { font } from 'constants/font';
import { sizeRem } from 'constants/metrics';
import styled from 'styled-components';

export const StartPageWrapper = styled.div`
  display: flex;
  height: 100%;
  padding: ${sizeRem.startPage.paddingTB} ${sizeRem.startPage.paddingLR};

  flex-direction: column;

  align-items: center;

  font-size: ${font.sizeBiggest};

  overflow: auto;
  background-color: ${(p) => p.theme.backgroundMain};
`;

export const StartPageButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 50%;
  width: 50%;
  justify-content: space-evenly;
  align-items: center;
  padding-right: 1rem;
`;

export const ProjectsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  width: 100%;

  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0;
  }
`;
