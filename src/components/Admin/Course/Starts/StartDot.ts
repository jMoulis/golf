import styled from '@emotion/styled';

export const StartDot = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  border: 1px solid ${({ color }) => (color === 'white' ? 'gray' : color)};
  height: 30px;
  width: 30px;
  min-height: 30px;
  min-width: 30px;
  border-radius: 100px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
