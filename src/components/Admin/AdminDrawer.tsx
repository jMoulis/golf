import { faArrowLeft } from '@fortawesome/pro-duotone-svg-icons';
import { SwipeableDrawer } from '@mui/material';
import { DeleteButton } from '../commons/DeleteButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';
import { RenderDrawerComponent } from './RenderDrawerComponent';
import { BOTTOM_NAVBAR_HEIGHT } from '../cssConstants';
import { theme } from '../../style/theme';
import { AdminMenuType } from './types';

const Header = styled.header<{ backgroundImage?: string }>`
  display: flex;
  align-items: center;
  padding: 10px 0;
  box-shadow: ${theme.shadows.listItem};
  background: #fff;
  background-image: url('${({ backgroundImage }) => backgroundImage}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
`;
const HeaderTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
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
      anchor='right'>
      <Header backgroundImage={selectedMenu?.img}>
        <DeleteButton onClick={onClose}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </DeleteButton>
        <HeaderTitle>{selectedMenu?.label}</HeaderTitle>
      </Header>
      <ContentWrapper>
        {selectedMenu?.component
          ? RenderDrawerComponent[selectedMenu.component]()
          : null}
      </ContentWrapper>
    </SwipeableDrawer>
  );
};
