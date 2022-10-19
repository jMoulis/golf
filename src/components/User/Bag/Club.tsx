import { BagType, ClubType } from 'components/types';
import { faPlus, faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { DeleteButton } from 'components/commons/Buttons/DeleteButton';
import { theme } from 'style/theme';
import styled from '@emotion/styled';
import { ListItem } from 'components/commons/List';
import React from 'react';
import { Flexbox } from 'components/commons';
import { ClubImage } from './ClubImage';

const CustomListItem = styled(ListItem)`
  border-radius: 5px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type Props = {
  club: ClubType;
  onSelect: (club: ClubType) => void;
  userClubs: BagType;
};

export const Club = ({ club, onSelect, userClubs }: Props) => {
  return (
    <CustomListItem key={club.id}>
      <Flexbox alignItems="center">
        <ClubImage clubName={club.name} clubThumbnail={club.thumbnail} />
        {club.name}
      </Flexbox>
      <DeleteButton
        buttonStyle={{
          backgroundColor: userClubs?.some(
            (userClub) => userClub.id === club.id
          )
            ? theme.colors.deleteButton
            : theme.colors.blue,
        }}
        icon={
          userClubs?.some((userClub) => userClub.id === club.id)
            ? faTrash
            : faPlus
        }
        onClick={() => onSelect(club)}
      />
    </CustomListItem>
  );
};
