import { sizeRem } from 'constants/metrics';
import styled from 'styled-components';

export const ProjectPageWrapper = styled.div`
  display: flex;
  height: calc(100vh - ${sizeRem.titlebar.height} - 1px);

  color: ${(p) => p.theme.primary};
  background-color: ${(p) => p.theme.backgroundMain};
`;

export const ProjectPageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
`;
