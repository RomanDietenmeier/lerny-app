import React from 'react';
import { NavLink } from 'react-router-dom';
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
        <NavLink to="/create">
          <StartPageButton>create</StartPageButton>
        </NavLink>
      </StartPageButtonWrapper>
    </StartPageWrapper>
  );
}
