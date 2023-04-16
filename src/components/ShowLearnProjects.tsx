import React from 'react';

import { useSelector } from 'react-redux';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';
import { LearnProjects } from '../redux/slices/learnProjectsSlice';
import {
  ShowLearnProjectsLearnPageButton as LearnPageButton,
  ShowLearnProjectsListItem as ListItem,
  ShowLearnProjectsUnorderedList as UnorderedList,
  ShowLearnProjectsWrapper as Wrapper,
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
    <Wrapper>
      {Object.entries(learnProjects).map(([project, pages], index) => {
        return (
          <div key={index}>
            <h2>{project}</h2>
            <UnorderedList>
              {pages.map((page, index) => {
                return (
                  <ListItem key={index}>
                    <LearnPageButton
                      onClick={() => {
                        if (!onClickOnLearnPage) return;
                        onClickOnLearnPage(project, page);
                      }}
                    >
                      {page}
                    </LearnPageButton>
                  </ListItem>
                );
              })}
            </UnorderedList>
          </div>
        );
      })}
    </Wrapper>
  );
}
