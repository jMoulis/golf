import styled from '@emotion/styled';
import { theme } from '../../../style/theme';

export const GameIndexHeaderCard = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: ${theme.shadows.listItem};
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  max-height: 100%;
  color: ${theme.colors.saveButton};
  /* & * {
    color: ${theme.colors.saveButton};
  } */
`;
