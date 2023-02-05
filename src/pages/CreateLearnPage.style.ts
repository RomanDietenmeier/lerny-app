import styled from 'styled-components';

export const CreateLearnPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(p) => p.theme.backgroundColor};
  overflow: auto;
`;

export const CreateLearnPageTitleInput = styled.input`
  background-color: ${(p) => p.theme.backgroundColor};
  color: ${(p) => p.theme.color};
  border: none;
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
  outline: none;
`;
