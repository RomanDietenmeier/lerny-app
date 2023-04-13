import React from 'react';

import { useSelector } from 'react-redux';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';
import { LearnProjects } from '../redux/slices/learnProjectsSlice';
import {
  ShowLearnProjectsLearnPageButton,
  ShowLearnProjectsListItem,
  ShowLearnProjectsUnorderedList,
  ShowLearnProjectsWrapper,
} from './ShowLearnProjects.style';

type ShowLearnProjectsProps = {
  learnProjects?: LearnProjects;
  onClickOnLearnPage?: (project: string, page: string) => void;
};

export function ShowLearnProjects({
  learnProjects,
  onClickOnLearnPage,
}: ShowLearnProjectsProps): JSX.Element {
  learnProjects = learnProjects ?? useSelector(selectLearnProjects);
  return (
    <ShowLearnProjectsWrapper>
      {Object.entries(learnProjects).map(([project, pages], index) => {
        return (
          <div key={index}>
            <h2>{project}</h2>
            <ShowLearnProjectsUnorderedList>
              {pages.map((page, index) => {
                return (
                  <ShowLearnProjectsListItem key={index}>
                    <ShowLearnProjectsLearnPageButton
                      onClick={() => {
                        if (!onClickOnLearnPage) return;
                        onClickOnLearnPage(project, page);
                      }}
                    >
                      {page}
                    </ShowLearnProjectsLearnPageButton>
                  </ShowLearnProjectsListItem>
                );
              })}
            </ShowLearnProjectsUnorderedList>
          </div>
        );
      })}
    </ShowLearnProjectsWrapper>
  );
}
