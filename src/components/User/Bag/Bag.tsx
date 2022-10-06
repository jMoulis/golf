import styled from '@emotion/styled';
import { BagClubType, BagType, ClubType } from 'components/types';
import { useRef } from 'react';
import { BagButton } from './BagButton';
import { AddClub } from './AddClub';
import { useToggle } from 'hooks/useToggle';
import { SwipableDefault } from 'components/commons/SwipableDefault';
import { List, ListItem } from 'components/commons/List';
import { sortArrayByAlphabet } from 'utils/global.utils';
import { getClubDistanceAverage } from 'utils/scoreUtils';
import { ClubListItem } from './ClubListItem';

export const Bag = ({
  clubs,
  onEdit,
  onAdd,
}: {
  clubs: BagType;
  onEdit: (club: ClubType) => void;
  onDelete: (club: ClubType) => void;
  onAdd: (club: ClubType) => void;
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
            .map((club, key) => (
              <ClubListItem club={club} key={key} onEdit={onEdit} />
            ))}
        </List>
        <AddClub onSelect={(club) => onAdd(club)} userClubs={clubs} />
      </SwipableDefault>
    </>
  );
};
