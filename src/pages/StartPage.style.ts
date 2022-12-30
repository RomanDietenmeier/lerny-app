import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { defaultButton } from '../styles/button.style';

export const StartPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.theme.backgroundColor};
`;

export const StartPageButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 50%;
  width: 50%;
  justify-content: space-evenly;
  align-items: center;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const StartPageNavLink = styled(NavLink)`
  width: inherit;
`;

export const StartPageButton = styled(defaultButton)`
  font-size: 3rem;
  width: 100%;
`;
