import { SwipeableDrawer } from '@mui/material';
import styled from '@emotion/styled';
import { RenderDrawerComponent } from './RenderDrawerComponent';
import { BOTTOM_NAVBAR_HEIGHT } from '../cssConstants';
import { theme } from '../../style/theme';
import { AdminMenuType } from './types';
import { NavigationButton } from '../commons/Buttons/NavigationButton';

const Header = styled.header<{ backgroundImage?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 0;
  box-shadow: ${theme.shadows.listItem};
  z-index: 1;
  height: 100px;
`;
const Background = styled.div<{ backgroundImage?: string }>`
  position: absolute;
  background: #fff;
  background-image: url('${({ backgroundImage }) => backgroundImage}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  filter: blur(2px);
`;

const HeaderTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 1;
  color: #fff;
`;

const ContentWrapper = styled.div`
  max-height: 100%;
  overflow: auto;
  padding-bottom: ${BOTTOM_NAVBAR_HEIGHT};
  padding-bottom: 10px;
  flex: 1;
  background-color: ${theme.colors.backgroundPage};
`;

type Props = {
  onClose: () => void;
  selectedMenu: AdminMenuType | null;
};

export const AdminDrawer = ({ onClose, selectedMenu }: Props) => {
  return (
    <SwipeableDrawer
      open={Boolean(selectedMenu)}
      onOpen={() => {}}
      onClose={onClose}
      PaperProps={{
        style: {
          minWidth: '100vw',
        },
      }}
      anchor="right"
    >
      <Header>
        <NavigationButton buttonStyle={{ zIndex: '1' }} onClick={onClose} />
        <HeaderTitle>{selectedMenu?.label}</HeaderTitle>
        <Background backgroundImage={selectedMenu?.img} />
      </Header>
      <ContentWrapper>
        {selectedMenu?.component
          ? RenderDrawerComponent[selectedMenu.component]()
          : null}
      </ContentWrapper>
    </SwipeableDrawer>
  );
};
