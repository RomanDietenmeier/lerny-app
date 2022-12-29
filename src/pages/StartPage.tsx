import React from 'react';
import { RouterRoutes } from '../constants/RouterRoutes';
import {
  StartPageButton,
  StartPageButtonWrapper,
  StartPageNavLink,
  StartPageWrapper,
} from './StartPage.style';

export function StartPage() {
  return (
    <StartPageWrapper>
      <StartPageButtonWrapper>
        <StartPageNavLink to="/import">
          <StartPageButton>import</StartPageButton>
        </StartPageNavLink>
        <StartPageNavLink to="/edit">
          <StartPageButton>edit</StartPageButton>
        </StartPageNavLink>
        <StartPageNavLink to={RouterRoutes.CreateLearnPage}>
          <StartPageButton>create</StartPageButton>
        </StartPageNavLink>
      </StartPageButtonWrapper>
    </StartPageWrapper>
  );
}
