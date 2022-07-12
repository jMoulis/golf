import styled from '@emotion/styled';
import { theme } from '../../../style/theme';

export const Tab = styled.div<{ selected?: boolean; color?: string }>`
  display: flex;
  border-radius: 20rem;
  padding: 5px;
  min-width: 100px;
  box-shadow: ${theme.shadows.button};
  background-color: ${({ selected }) =>
    selected ? '#fff' : 'rgba(255,255,255,0.3)'};
  color: ${({ selected, color }) => (selected ? color : '#fff')};
`;
