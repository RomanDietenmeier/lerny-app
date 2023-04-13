import { ShowLearnProjectsLearnPageButton } from 'components/ShowLearnProjects.style';
import styled from 'styled-components';

export const ExportLearnProjectWrapper = styled.div`
  margin: 1rem;
  background-color: ${(p) => p.theme.backgroundColor};
`;

export const ExportLearnProjectTitle = styled.div`
  width: 100%;

  font-size: 2rem;

  text-align: center;
  text-transform: uppercase;
`;

export const ExportLearnProjectButtonGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
`;

export const ExportLearnProjectButton = styled(
  ShowLearnProjectsLearnPageButton
)`
  width: fit-content;
  margin: 0.5rem 0;
`;
