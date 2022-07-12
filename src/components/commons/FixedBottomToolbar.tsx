import styled from '@emotion/styled';
import { theme } from '../../style/theme';

export const FixedBottomToolbar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: #fff;
  box-shadow: ${theme.shadows.listItem};
  min-height: 80px;
`;
