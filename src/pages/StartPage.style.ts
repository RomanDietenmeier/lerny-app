import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { DefaultButton } from '../styles/button.style';

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

export const StartPageButton = styled(DefaultButton)`
  font-size: 3rem;
  width: 100%;
`;
