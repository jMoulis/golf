import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flexbox } from '../../commons';
import { PageHeader } from '../../commons/Core/PageHeader';
import { ListItem } from '../../commons/List';
import { UsersSwipeMenu } from '../../commons/UsersSwipeMenu/UsersSwipeMenu';
import { UserType } from '../../types';
import { Avatar } from '../../User/Avatar';
import { NameTag } from '../../User/UserStyledComponents';
import { useUser } from '../../User/useUser';

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
  title: string;
  headerTheme: string;
};
export const CoachIndex = ({ title, headerTheme }: Props) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  if (!user?.id) return null;

  const handleSelectUser = (selectedUser: UserType) => {
    navigate(`${selectedUser.id}`);
  };
  return (
    <>
      <PageHeader backgroundColor={headerTheme}>
        Coach - {user.firstname}
      </PageHeader>
      <Flexbox flexWrap="wrap">
        <CustomListItem as="div">
          <Link to={`${user.id}`}>
            <Flexbox flexDirection="column" alignItems="center">
              <Avatar user={user} />
              <NameTag>{title}</NameTag>
            </Flexbox>
          </Link>
        </CustomListItem>
        <CustomListItem as="div" onClick={() => setOpen(true)}>
          <Flexbox
            flexWrap="wrap"
            justifyContent="space-around"
            styling={{ overflow: 'auto' }}
          >
            {(user.students || []).map((student, key) => (
              <Flexbox key={key} flexDirection="column" alignItems="center">
                <Avatar
                  styling={{
                    width: '30px',
                    height: '30px',
                  }}
                  user={student}
                />
              </Flexbox>
            ))}
          </Flexbox>
          <NameTag>Mes élèves</NameTag>
        </CustomListItem>
      </Flexbox>
      <UsersSwipeMenu
        users={user.students || []}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        onSelectUser={handleSelectUser}
      />
    </>
  );
};
