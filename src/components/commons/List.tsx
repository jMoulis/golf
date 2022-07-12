import styled from '@emotion/styled';
import { theme } from '../../style/theme';

export const List = styled.ul`
  flex: 1;
  background-color: ${theme.colors.backgroundPage};
  position: relative;
  max-height: 90vh;
  overflow: auto;
`;

export const ListItem = styled.li<{ selected?: boolean }>`
  margin: 20px;
  border-radius: 15px;
  background-color: ${({ selected }) => (selected ? '#3D80D9' : '#fff')};
  padding: 10px;
  color: ${({ selected }) => selected && '#fff'};
  box-shadow: 3px 5px 11px 0px rgba(0, 0, 0, 0.23);
`;
