import styled from 'styled-components';

export const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${(p) => p.theme.color};
`;
