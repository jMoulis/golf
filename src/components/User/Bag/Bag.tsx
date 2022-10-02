import styled from '@emotion/styled';
import { DeleteButton } from 'components/commons/Buttons/DeleteButton';
import { BagClubType, BagType, ClubType } from 'components/types';
import { useRef } from 'react';
import { BagButton } from './BagButton';
import { AddClub } from './AddClub';
import { useToggle } from 'hooks/useToggle';
import { SwipableDefault } from 'components/commons/SwipableDefault';
import { List, ListItem } from 'components/commons/List';
import { sortArrayByAlphabet } from 'utils/global.utils';
import { getClubDistanceAverage } from 'utils/scoreUtils';

const CustomListItem = styled(ListItem)`
  border-radius: 5px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Bag = ({
  clubs,
  onEdit,
}: {
  clubs: BagType;
  onEdit: (club: ClubType) => void;
  onDelete: (club: ClubType) => void;
}) => {
  const { open, onClose, onOpen } = useToggle();

  return (
    <>
      <BagButton onOpen={onOpen} />
      <SwipableDefault
        title="Mon sac"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
      >
        <List>
          {clubs
            .sort((a, b) => a.order - b.order)
            .map((club) => (
              <CustomListItem key={club.id}>
                <span>{club.name}</span>
                <span>distance</span>
                <span>{getClubDistanceAverage(club.distances)}</span>
                <DeleteButton onClick={() => onEdit(club)} />
              </CustomListItem>
            ))}
        </List>
        <AddClub onSelect={(club) => onEdit(club)} userClubs={clubs} />
      </SwipableDefault>
    </>
  );
};
