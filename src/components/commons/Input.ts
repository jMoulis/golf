import styled from '@emotion/styled';
import { theme } from '../../style/theme';

export const Input = styled.input`
  padding: 10px;
  border: 1px solid ${theme.colors.blue};
  border-radius: 3px;
  font-size: 17px;
  &::placeholder {
    font-style: italic;
  }
`;
