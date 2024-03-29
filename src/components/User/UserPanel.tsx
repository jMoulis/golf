import styled from '@emotion/styled';
import { SwipeableDrawer } from '@mui/material';
import React from 'react';
import { Flexbox } from '../commons';
import { Avatar } from './Avatar';
import { NameTag } from './UserStyledComponents';
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

export function UserPanel() {
  const { onOpen, onClose, open } = useToggle();
  const { user } = useUser();

  return (
    <Root>
      {user ? (
        <Flexbox flexDirection="column" onClick={onOpen} alignItems="center">
          <Avatar user={user} />
          <Flexbox>
            <NameTag style={{ marginRight: '10px', color: '#fff' }}>
              {user.firstname}
            </NameTag>
            <NameTag style={{ color: '#fff' }}>{user.lastname}</NameTag>
          </Flexbox>
        </Flexbox>
      ) : null}

      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor="bottom"
        open={open}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        onClose={onClose}
        onOpen={onOpen}
      >
        <SwipeMenuHeader title={user?.firstname || ''} />
        {user ? <UserForm onClose={onClose} user={user} /> : null}
      </SwipeableDrawer>
    </Root>
  );
}
