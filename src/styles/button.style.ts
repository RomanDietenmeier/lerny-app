import styled from 'styled-components';

export const DefaultButton = styled.button`
  background-color: ${(p) => p.theme.backgroundColorButton};
  color: ${(p) => p.theme.colorButton};
  border-radius: 1rem;
  padding: 1rem;
  border: none;

  box-shadow: ${(p) => p.theme.backgroundColorComplementary} 0 0 2px 0;

  :hover {
    background-color: ${(p) => p.theme.backgroundColorHoverButton};
  }
`;
