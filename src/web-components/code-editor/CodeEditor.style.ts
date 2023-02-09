import styled from 'styled-components';
import { DefaultButton } from '../../styles/button.style';

export const CodeEditorButtonsWrapper = styled.div<{
  height: string;
}>`
  height: ${(p) => p.height};
`;

export const CodeEditorButton = styled(DefaultButton)`
  margin: 0.25rem;
  border-radius: 0.25rem;
  padding: 0.25rem;
  :first-child {
    margin-left: 3.25rem;
  }
`;
