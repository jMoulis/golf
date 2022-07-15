import styled from '@emotion/styled';
import { BOTTOM_NAVBAR_HEIGHT } from '../cssConstants';

export const FloatingButton = styled.button<{
  backgroundColor?: string;
  color?: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor || '#fff'};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20rem;
  height: 60px;
  width: 60px;
  position: fixed;
  box-shadow: 3px 5px 11px 0px rgba(0, 0, 0, 0.23);
  bottom: calc(${BOTTOM_NAVBAR_HEIGHT} + 10px);
  right: 10px;
  * {
    color: ${({ color }) => color};
  }
`;
