import { Flexbox } from '../commons';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { Avatar } from './Avatar';
import { NameTag } from './UserStyledComponents';
import { SwipeableDrawer } from '@mui/material';
import { iOS } from '../../utils/global.utils';
import { useToggle } from '../../hooks/useToggle';
import { theme } from '../../style/theme';
import { SwipeMenuHeader } from '../commons/SwipeMenuHeader';
import { useUser } from './useUser';
import { UserForm } from './UserForm';

const Root = styled.nav`
  flex-direction: column;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const UserPanel = () => {
  const { onOpen, onClose, open } = useToggle();
  const { user, getUser } = useUser();

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <Root>
      {user ? (
        <Flexbox flexDirection='column' onClick={onOpen} alignItems='center'>
          <Avatar
            user={user}
            Placeholder={
              <div
                style={{
                  height: '70px',
                  width: '70px',
                }}>
                Selectionnes une photo
              </div>
            }
          />
          <Flexbox>
            <NameTag style={{ marginRight: '10px' }}>{user.firstname}</NameTag>
            <NameTag>{user.lastname}</NameTag>
          </Flexbox>
        </Flexbox>
      ) : null}

      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor='bottom'
        open={open}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        onClose={onClose}
        onOpen={onOpen}>
        <SwipeMenuHeader title={user?.firstname || ''} />
        {user ? <UserForm onClose={onClose} user={user} /> : null}
      </SwipeableDrawer>
    </Root>
  );
};
