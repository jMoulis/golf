import styled from '@emotion/styled';
import { SwipeableDrawer } from '@mui/material';
import { theme } from '../../../style/theme';
import { iOS } from '../../../utils/global.utils';
import { UserType } from '../../types';
import { Avatar } from '../../User/Avatar';
import { NameTag } from '../../User/UserStyledComponents';
import { Flexbox } from '../Flexbox';
import { List, ListItem } from '../List';
import { SwipeMenuHeader } from '../SwipeMenuHeader';

const CustomList = styled(List)`
  display: flex;
  align-items: flex-start;
`;

const CustomListItem = styled(ListItem)`
  height: auto;
  flex: 1;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  max-height: 150px;
  align-items: center;
`;

type Props = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  users: UserType[];
  onSelectUser: (user: UserType) => void;
};

export const UsersSwipeMenu = ({
  open,
  onOpen,
  onClose,
  users,
  onSelectUser,
}: Props) => {
  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      <SwipeMenuHeader title="Mes étudiants" />
      <CustomList>
        {users.map((user, key) => (
          <CustomListItem key={key} onClick={() => onSelectUser(user)}>
            <Flexbox flexDirection="column" alignItems="center">
              <Avatar user={user} />
              <NameTag>{user.firstname}</NameTag>
            </Flexbox>
          </CustomListItem>
        ))}
      </CustomList>
    </SwipeableDrawer>
  );
};
