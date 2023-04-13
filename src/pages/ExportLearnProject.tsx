import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLearnProjects } from 'redux/selectors/learnProjectsSelectors';
import { setLearnProjects } from 'redux/slices/learnProjectsSlice';
import useAsyncEffect from 'use-async-effect';
import {
  ExportLearnProjectButton as Button,
  ExportLearnProjectButtonGrid as ButtonGrid,
  ExportLearnProjectTitle as Title,
  ExportLearnProjectWrapper as Wrapper,
} from './ExportLearnProject.styles';

export function ExportLearnProject(): JSX.Element {
  const dispatch = useDispatch();
  useAsyncEffect(async () => {
    const learnProjects =
      await window.electron.getLocalLearnProjectAndLearnPages();

    dispatch(setLearnProjects(learnProjects));
  }, []); // temp here and above

  const learnProject = useSelector(selectLearnProjects);

  return (
    <Wrapper>
      <Title>Select a project to export</Title>
      <ButtonGrid>
        {Object.keys(learnProject).map((project, index) => {
          return (
            <Button
              key={index}
              onClick={async () => {
                await window.electron.learnProject.exportProject(project);
              }}
            >
              {project}
            </Button>
          );
        })}
      </ButtonGrid>
    </Wrapper>
  );
}
