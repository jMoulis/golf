import { faArrowLeft } from '@fortawesome/pro-duotone-svg-icons';
import { SwipeableDrawer } from '@mui/material';
import { theme } from '../../style/theme';
import { DeleteButton } from '../commons/DeleteButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ENUM_MENU_COMPONENT } from './enum';
import styled from '@emotion/styled';
import { RenderDrawerComponent } from './RenderDrawerComponent';

const Header = styled.header`
  display: flex;
`;
type Props = {
  onSelectMenu: (menuComponent: ENUM_MENU_COMPONENT | null) => void;
  selectedComponent: ENUM_MENU_COMPONENT | null;
};

export const AdminDrawer = ({ onSelectMenu, selectedComponent }: Props) => {
  return (
    <SwipeableDrawer
      open={Boolean(selectedComponent)}
      onOpen={() => {}}
      onClose={() => onSelectMenu(null)}
      PaperProps={{
        style: {
          minWidth: '100vw',
        },
      }}
      anchor='right'>
      <Header>
        <DeleteButton onClick={() => onSelectMenu(null)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </DeleteButton>
        {selectedComponent ? RenderDrawerComponent[selectedComponent]() : null}
      </Header>
    </SwipeableDrawer>
  );
};
