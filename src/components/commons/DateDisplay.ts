import styled from '@emotion/styled';

export const DateDisplay = styled.span<{ margin?: string }>`
  font-size: 14px;
  margin-left: ${({ margin }) => margin};
  font-style: italic;
`;
