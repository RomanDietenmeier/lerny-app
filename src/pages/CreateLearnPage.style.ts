import styled from 'styled-components';
import { defaultButton } from '../styles/button.style';

export const CreateLearnPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(p) => p.theme.backgroundColor};
  overflow: auto;
`;

export const CreateLearnPageSaveButton = styled(defaultButton)`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 1;
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
