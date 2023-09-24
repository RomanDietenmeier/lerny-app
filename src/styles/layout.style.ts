import { size, sizeRem } from 'constants/metrics';
import styled from 'styled-components';

export const RowItems = styled.div`
  display: flex;

  align-items: center;
`;

export const RowItemsSpaced = styled(RowItems)`
  > *:not(:last-child) {
    margin-right: ${sizeRem.default.space};
  }
`;
export const RowItemsSpacedHalf = styled(RowItems)`
  > *:not(:last-child) {
    margin-right: ${size.default.space / 2}rem;
  }
`;
export const RowItemsSpacedBig = styled(RowItems)`
  > *:not(:last-child) {
    margin-right: ${size.default.space * 2}rem;
  }
`;

export const RowItemsFlex = styled(RowItems)`
  height: 100%;
`;
