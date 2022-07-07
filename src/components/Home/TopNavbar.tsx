import styled from '@emotion/styled';
import { TOP_NAVBAR_HEIGHT } from '../cssConstants';
import { UserPanel } from './UserPanel';

const Root = styled.div`
  height: ${TOP_NAVBAR_HEIGHT};
`;

export const TopNavbar = () => {
  return (
    <Root>
      <UserPanel />
    </Root>
  );
};
