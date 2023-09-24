import { sizeRem } from 'constants/metrics';
import styled from 'styled-components';

type EllipsisWrapperProps = {
  hoverColor: string;
};
export const EllipsisWrapper = styled.div<EllipsisWrapperProps>`
  display: flex;
  padding: ${sizeRem.default.spaceHalf};
  border-radius: ${sizeRem.default.borderRadius};

  cursor: pointer;
  &:hover {
    background-color: ${(p) => p.hoverColor};
  }
`;
