import React from 'react';
import {
  StartPageLeanProjectsListItem,
  StartPageLearnProjectsLearnPageButton,
  StartPageLearnProjectsUnorderedList,
  StartPageLearnProjectsWrapper,
} from '../pages/StartPage.style';
import { LearnProjects } from '../redux/slices/learnProjectsSlice';

type ShowLearnProjectsProps = {
  learnProjects: LearnProjects;
  onClickOnLearnPage?: (project: string, page: string) => void;
};

export function ShowLearnProjects({
  learnProjects,
  onClickOnLearnPage,
}: ShowLearnProjectsProps): JSX.Element {
  return (
    <StartPageLearnProjectsWrapper>
      {Object.entries(learnProjects).map(([project, pages], index) => {
        return (
          <div key={index}>
            <h2>{project}</h2>
            <StartPageLearnProjectsUnorderedList>
              {pages.map((page, index) => {
                return (
                  <StartPageLeanProjectsListItem key={index}>
                    <StartPageLearnProjectsLearnPageButton
                      onClick={() => {
                        if (!onClickOnLearnPage) return;
                        onClickOnLearnPage(project, page);
                      }}
                    >
                      {page}
                    </StartPageLearnProjectsLearnPageButton>
                  </StartPageLeanProjectsListItem>
                );
              })}
            </StartPageLearnProjectsUnorderedList>
          </div>
        );
      })}
    </StartPageLearnProjectsWrapper>
  );
}
