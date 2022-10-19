import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FloatingButton } from 'components/commons/Buttons/FloatingButton';
import { List } from 'components/commons/List';
import { SwipableDefault } from 'components/commons/SwipableDefault';
import { BagType, ClubType } from 'components/types';
import { useToggle } from 'hooks/useToggle';
import React from 'react';
import { Club } from './Club';

import { useClubs } from './useClubs';

type Props = {
  onSelect: (club: ClubType) => void;
  userClubs: BagType;
};

export const AddClub = ({ onSelect, userClubs }: Props) => {
  const { open, onClose, onOpen } = useToggle();

  const { clubs } = useClubs();

  return (
    <>
      <FloatingButton backgroundColor="#000" onClick={onOpen} color="#fff">
        <FontAwesomeIcon icon={faPlus} size="3x" />
      </FloatingButton>
      <SwipableDefault
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        title="Ajouter un club"
      >
        <List>
          {clubs
            .sort((a, b) => a.order - b.order)
            .map((club) => {
              return (
                <Club
                  key={club.id}
                  club={club}
                  onSelect={onSelect}
                  userClubs={userClubs}
                />
              );
            })}
        </List>
      </SwipableDefault>
    </>
  );
};
