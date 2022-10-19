import { BagType, ClubType } from 'components/types';
import React from 'react';
import { useToggle } from 'hooks/useToggle';
import { SwipableDefault } from 'components/commons/SwipableDefault';
import { List } from 'components/commons/List';
import { AddClub } from './AddClub';
import { BagButton } from './BagButton';
import { ClubListItem } from './ClubListItem';

export const Bag = ({
  clubs,
  onEdit,
  onAdd,
  onDelete,
}: {
  clubs: BagType;
  onEdit: (club: ClubType) => void;
  onDelete: (clubID: string) => void;
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
              <ClubListItem
                club={club}
                key={key}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        </List>
        <AddClub onSelect={(club) => onAdd(club)} userClubs={clubs} />
      </SwipableDefault>
    </>
  );
};
