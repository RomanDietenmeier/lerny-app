import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { defaultButton } from '../styles/button.style';

export const StartPageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding-left: 1rem;
  overflow: hidden;
  background-color: ${(p) => p.theme.backgroundColor};
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

export const StartPageNavLink = styled(NavLink)`
  width: inherit;
`;

export const StartPageButton = styled(defaultButton)`
  font-size: 3rem;
  width: 100%;
`;

export const StartPageLearnProjectsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0;
  }
`;

export const StartPageLearnProjectsUnorderedList = styled.ul`
  list-style-type: none;
`;

export const StartPageLeanProjectsListItem = styled.li`
  margin-bottom: 0.5rem;
`;

export const StartPageLearnProjectsLearnPageButton = styled(defaultButton)`
  font-size: 1.25rem;
  padding: 0.5rem;
  margin-right: 2px; /* so that the box-shadow is not cut off */
`;
