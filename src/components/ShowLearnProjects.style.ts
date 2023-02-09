import styled from 'styled-components';
import { DefaultButton } from '../styles/button.style';

export const ShowLearnProjectsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;

  ::-webkit-scrollbar {
    width: 0;
  }
`;

export const ShowLearnProjectsUnorderedList = styled.ul`
  list-style-type: none;
`;

export const ShowLearnProjectsListItem = styled.li`
  margin-bottom: 0.5rem;
`;

export const ShowLearnProjectsLearnPageButton = styled(DefaultButton)`
  font-size: 1.25rem;
  padding: 0.5rem;
  margin-right: 2px; /* so that the box-shadow is not cut off */
`;
