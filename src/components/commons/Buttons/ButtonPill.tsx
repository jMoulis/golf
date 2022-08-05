import styled from '@emotion/styled';
import { theme } from '../../../style/theme';

export const ButtonPill = styled.button<{
  color?: string;
  backgroundColor?: string;
}>`
  padding: 10px 30px;
  box-shadow: ${theme.shadows.button};
  font-size: 20px;
  max-height: 47px;
  white-space: nowrap;
  text-transform: uppercase;
  border: none;
  margin: 0.25rem;
  color: ${({ color }) => color || '#fff'};
  border-radius: 30px;
  background-color: ${({ backgroundColor }) =>
    backgroundColor || theme.colors.saveButton};
  &:disabled {
    background-color: ${theme.colors.deleteButton};
    color: rgba(255, 255, 255, 0.5);
  }
`;
