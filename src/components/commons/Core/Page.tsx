import styled from '@emotion/styled';
import { theme } from '../../../style/theme';
import { BOTTOM_NAVBAR_HEIGHT } from '../../cssConstants';

export const Page = styled.main`
  label: MainContent;
  display: flex;
  flex-direction: column;
  height: calc(100% - ${BOTTOM_NAVBAR_HEIGHT});
  position: relative;
  overflow: hidden;
  background-color: ${theme.colors.backgroundPage};
`;
