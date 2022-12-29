import React from 'react';
import { NavLink } from 'react-router-dom';
import { RouterRoutes } from '../constants/RouterRoutes';
import {
  StartPageButton,
  StartPageButtonWrapper,
  StartPageWrapper,
} from './StartPage.style';

export function StartPage() {
  return (
    <StartPageWrapper>
      <StartPageButtonWrapper>
        <NavLink to="/import">
          <StartPageButton>import</StartPageButton>
        </NavLink>
        <NavLink to={RouterRoutes.CreateLearnPage}>
          <StartPageButton>create</StartPageButton>
        </NavLink>
      </StartPageButtonWrapper>
    </StartPageWrapper>
  );
}
